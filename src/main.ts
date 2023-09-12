import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
// It library provides nestjs
// eslint-disable-next-line import/no-extraneous-dependencies
import * as bodyParser from 'body-parser';

import { MAXIMUM_UPLOAD_SIZE } from './app.constants';
import { AppModule } from './app.module';
import { FirebaseInterceptor } from './modules/firebase/firebase.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const firebaseInterceptor = app.get(FirebaseInterceptor);

  const port = configService.getOrThrow('app.port');

  app.useGlobalInterceptors(firebaseInterceptor);

  app.use(bodyParser.json({ limit: MAXIMUM_UPLOAD_SIZE }));
  app.use(
    bodyParser.urlencoded({ limit: MAXIMUM_UPLOAD_SIZE, extended: true }),
  );

  await app.listen(port);
}

void bootstrap();
