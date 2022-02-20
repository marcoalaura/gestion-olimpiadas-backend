import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
import { Session } from './core/authentication/entity/session.entity';
import * as YAML from 'yaml';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';

import {
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_NAME,
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_ROOT,
} from './common/constants';
// import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // swagger
  createSwagger(app);

  // configuration app
  const repository = getConnection().getRepository(Session);
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'base.connect.sid',
      cookie: {
        httpOnly: true,
        secure: JSON.parse(process.env.REFRESH_TOKEN_SECURE),
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000,
      },
      store: new TypeormStore({ repository, expirationInterval: 3600000 }), //ms
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '20mb' }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(helmet());

  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN'));
  // app.useGlobalInterceptors(new WrapResponseInterceptor());
  const port = configService.get('PORT');
  await app.listen(port);
  console.log(
    `Path de la aplicación configurada como /${configService.get(
      'PATH_SUBDOMAIN',
    )}`,
  );
  console.log(`Aplicación iniciada en el puerto ${port}`);
}

function createSwagger(app: INestApplication) {
  if (process.env.NODE_ENV === 'production') return;
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addServer(`/${app.get(ConfigService).get('PATH_SUBDOMAIN')}`)
    .addServer('http://localhost:3000/api')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
  try {
    const docs = fs.readFileSync('./docs/openapi.yaml');
    SwaggerModule.setup(
      `${SWAGGER_API_ROOT}.yaml`,
      app,
      YAML.parse(docs.toString('utf8')),
    );
  } catch (error) {
    console.error(error);
  }
}
bootstrap();
