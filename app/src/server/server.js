const dotenv = require('dotenv');

dotenv.config();

const sslRedirect = require('heroku-ssl-redirect');

const Sentry = require("@sentry/node");

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const proxy = require('express-http-proxy');
const jwt = require('express-jwt');

const DIST_DIR = path.resolve('./app');

const port = process.env.PORT || 4000;
const API_HOST = 'http://localhost:3000';
const CDN_HOST = 'http://localhost:3000';

const compression = require('compression');
const express = require('express');
const fileUpload = require('express-fileupload');

const { tmpdir } = require('os');

const sendFile = async (filepath, destination, authorizationHeader) => {
  console.log('sendFile...')
  const form = new FormData();

  form.append('file', fs.createReadStream(filepath));

  return new Promise((resolve, reject) => {
    console.log('sendFile... promise');

    form
      .submit(
        {
          host: 'localhost',
          port: '3000',
          path: `/fba/upload/${destination}`,
          headers: {
            ...form.getHeaders(),
            authorization: authorizationHeader,
          }
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          let createdUrl = '';

          res.on('data', (data) => createdUrl+= data);
          res.on('end', () => resolve(createdUrl));
          res.on('error', (error) => reject(error));
        });
  })
}

Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND,
});

const app = express();

app
  .use((request, _, next) => {
    console.log('new request', request.url);

    try {
      Sentry.captureEvent({
        level: Sentry.Severity.Log,
        message: `[FE:SERVER] ${request.method} ${request.url}`,
        request:{
          url: request.url,
          method: request.method,
          headers: request.headers,
        },
        user: request.user,
        extra: { token: request.headers['authorization']}
      });
    } catch (error) {
      console.log('error sending to sentry')
      console.error(error)
    }

    return next()
  })
  .use(Sentry.Handlers.requestHandler())
  .use(sslRedirect.default())
  .use(compression())
  .use(express.json())
  .use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    debug: true,
  }))
  .post('/cdn/upload/*', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    console.log('req.files', req.files);

    let allowed = false;

    switch(req.files.file.mimetype) {
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/gif':
        allowed = true;
        break;
      default:
        allowed = false;
    }

    if (!allowed) {
      return res.status(400).send('File type not allowed.');
    }

    const destination = req.originalUrl.substring(12);
    const authorizationHeader = req.headers['authorization'];

    const tmpfileLocation = `${tmpdir}/${req.files.file.name}`;

    console.log('tmpfileLocation', tmpfileLocation)

    await req.files.file.mv(tmpfileLocation).catch((error) =>{
      console.error(error);
      res.status(500).send('failed to save file')
    });

    sendFile(
      tmpfileLocation,
      destination,
      authorizationHeader,
    )
      .then((url) => {
        console.log('GOT URL ', url);
        res.send(url)
      })
      .catch(err => {
        console.error(err);
        res.status(err.statusCode || 500).send(err.message);
      }).finally(() => {

        fs.unlink(tmpfileLocation, () => console.log(`deleted uploaded file ${tmpfileLocation}`));
      });
  })
  // PROXY API CALLS
  .use('/api', proxy(API_HOST, {
    preserveHostHdr: true
  }))
  // PROXY CDN CALLS
  .use('/cdn/*', proxy(CDN_HOST, {
    preserveHostHdr: true,
    proxyReqPathResolver: (req) => {
      const redirect = req.originalUrl.substring(4);
      return `/fba${redirect}`;
    }
  }))
  // Static content
  .use(express.static(DIST_DIR))
  // for everything else serve index.html
  .use((_req, res) => {
    res.sendFile(DIST_DIR + '/index.html');
  })
  .use(Sentry.Handlers.errorHandler())
  // Start server
  .listen(port, () => {
    console.info('Port: ' + port);
    console.info('DIST_DIR: ' + DIST_DIR);
  });
