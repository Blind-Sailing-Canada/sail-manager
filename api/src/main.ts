import dotenv = require('dotenv');
dotenv.config();
import * as morgan from 'morgan';
import * as session from 'express-session';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFilter } from './utils/all-exception.filter';
import { JwtObject } from './types/token/jwt-object';
import { LoggingInterceptor } from './utils/logging.interceptor';

// console.log('process.env', process.env);

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  Sentry.init({
    dsn: process.env.SENTRY_DSN_BACKEND,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app: app as any }),
    ],

    tracesSampleRate: 1.0,
  });

  Sentry.captureEvent({
    level: 'info',
    message: 'Sentry initialized in API main.ts',
  });

  process
    .on('unhandledRejection', (reason) => {
      Sentry.captureMessage(JSON.stringify(reason, null, 2), 'error');
    })
    .on('uncaughtException', (error) => {
      Sentry.captureException(error);
      process.exit(1);
    });

  const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: { secure: process.env.NODE_ENV === 'prod' },
    resave: false,
    saveUninitialized: false,
  };

  if (process.env.NODE_ENV === 'prod') {
    sess.cookie.secure = true; // serve secure cookies
    app.set('trust proxy', 1);
  }

  const csurfValidation = csurf({ cookie: false });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.useGlobalInterceptors(new LoggingInterceptor());
  morgan.token('remote-user', (req) => {
    if (!req.user && !req.original_user) {
      return '-';
    }

    const user: JwtObject = (req.user || req.original_user) as JwtObject;
    const username = user.username?.split(' ')[0] || user.provider_user?.email || '-';
    const userid = user.profile_id || user.sub || user.user_id || user.provider_user?.id || '-';

    return `${userid}:${username}`;
  });

  app.use(morgan('combined'));
  app.useGlobalFilters(new AllExceptionFilter());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();
  app.use(cookieParser());
  app.use(session(sess));
  app.use((req, res, next) => {
    if (req.method === 'POST' && req.originalUrl.startsWith('/form-response')) {
      return next();
    }

    if (req.method === 'POST' && req.originalUrl.startsWith('/fba/upload/images/')) {
      return next();
    }

    if (req.method === 'POST' && req.originalUrl.startsWith('/fba/upload/videos/')) {
      return next();
    }

    if (req.method === 'POST' && req.originalUrl.startsWith('/fba/upload/documents/')) {
      return next();
    }

    if (req.originalUrl.startsWith('/stripe/webhook')) {
      return next();
    }

    if (req.originalUrl.startsWith('/auth/logout')) {
      return next();
    }

    return csurfValidation(req, res, next);
  });
  app.use(function (err, _, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    res.status(403)
    res.send('Invalid session. Please log in again.')
  });
  app.use((req, res, next) => {
    if (req.csrfToken) {
      res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
  });

  const API_PORT = +process.env.API_PORT || +process.env.SAIL_MANAGER_BE_PORT || 8081;

  if (process.env.NODE_ENV !== 'prod') {
    const options = new DocumentBuilder()
      .setTitle('Sail Manager API')
      .setVersion('1.0')
      .addServer('/')
      .addServer('/api')
      .addServer(`http://localhost:${API_PORT}`)
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  console.log(`api server listening on port ${API_PORT}`);
  console.log('ENV FILE_SIZE_UPLOAD as string', process.env.FILE_SIZE_UPLOAD);
  console.log('ENV FILE_SIZE_UPLOAD as number', +process.env.FILE_SIZE_UPLOAD);
  console.log('Finale file size', +process.env.FILE_SIZE_UPLOAD || 100 * 1024 * 1024);

  await app.listen(API_PORT);
}

bootstrap();
