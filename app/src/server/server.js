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

const PORT = +process.env.PORT || +process.env.SAIL_MANAGER_FE_PORT || 8080;

const SAIL_MANAGER_BE_PORT = +process.env.SAIL_MANAGER_BE_PORT || 8081;
const SAIL_MANAGER_BE_URL = process.env.SAIL_MANAGER_BE_URL || 'http://localhost'
const CDN_HOST_URL = process.env.CDN_HOST_URL || 'http://localhost'
const CDN_HOST_PORT = +process.env.SAIL_MANAGER_BE_PORT || 8081;

const API_HOST = `${SAIL_MANAGER_BE_URL}:${SAIL_MANAGER_BE_PORT}`;
const CDN_HOST = `${CDN_HOST_URL}:${CDN_HOST_PORT}`;

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
          host: CDN_HOST_URL,
          port: CDN_HOST_PORT,
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
        level: Sentry.Severity.Info,
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


  if (process.env.NODE_ENV === 'prod') {
    app.use(sslRedirect.default())
  }

  app
  .use(compression())
  .use(express.json())
  .use(fileUpload({
    limits: { fileSize: +process.env.FILE_SIZE_UPLOAD || 10 * 1024 * 1024 },
    debug: true,
  }))
  .post('/cdn/upload/*', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), async (req, res) => {
    if (req.user?.status !== 'APPROVED') {
      return res.status(401).send('Not authorized to upload files.');
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    console.log('req.files', req.files);

    let allowed = false;

    switch(req.files.file.mimetype) {
      case 'application/octet-stream': // word docx
      case 'application/pdf':
      case 'application/rtf':
      case 'image/gif':
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'text/plain':
        allowed = true;
        break;
      default:
        allowed = false;
    }

    if (!allowed) {
      return res.status(400).send(`File type not allowed: req.files.file.mimetype.`);
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

        try {
          const jsonUrl = typeof url === 'object' ? url : JSON.parse(url)

          if (jsonUrl.message) {
            return res.status(500).send(jsonUrl.message)
          }
        } catch (error) {
          console.error(error)
        }

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
  .listen(PORT, () => {
    console.info('Port: ' + PORT);
    console.info('DIST_DIR: ' + DIST_DIR);
  });
