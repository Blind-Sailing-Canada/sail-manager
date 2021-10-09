import dotenv = require('dotenv');
dotenv.config();

import * as morgan from 'morgan';
import * as helmet from 'helmet';
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
import { LoggingInterceptor } from './utils/logging.interceptor';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  Sentry.init({
    dsn: process.env.SENTRY_DSN_BACKEND,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app: app as any }),
    ],

    tracesSampleRate: 1.0,
  });

  Sentry.captureEvent({
    level: Sentry.Severity.Info,
    message: 'Sentry initialized in main.ts',
  });

  process
    .on('unhandledRejection', (reason) => {
      Sentry.captureMessage(JSON.stringify(reason, null, 2), Sentry.Severity.Error);
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
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();
  app.use(cookieParser());
  app.use(session(sess));
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/fba/upload/images/')){
      return next();
    }

    if (req.originalUrl.startsWith('/auth/logout')) {
      return next();
    }

    return csurfValidation(req,res, next);
  });
  app.use(helmet());
  app.use((req, res, next) => {
    if (req.method === 'GET' && req.originalUrl === '/csrfToken') {
      return res.send({ csrfToken: req.csrfToken() });
    }
    next();
  });
  app.use(morgan('combined'));
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/time')){
      return res.send(new Date());
    }

    return next();
  });

  const options = new DocumentBuilder()
    .setTitle('Mysql typeorm')
    .setVersion('1.0')
    .addServer('/')
    .addServer('/api')
    .addServer('http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  console.log('api server listening on port 3000');

  await app.listen(3000);
}

bootstrap();
