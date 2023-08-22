import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';
import { FirebaseInterceptor } from './modules/firebase/firebase.interceptor';
import { MAXIMUM_UPLOAD_SIZE } from './app.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const firebaseInterceptor = app.get(FirebaseInterceptor);

  const PORT = configService.getOrThrow('app.port');

  app.useGlobalInterceptors(firebaseInterceptor);

  app.use(bodyParser.json({ limit: MAXIMUM_UPLOAD_SIZE }));
  app.use(
    bodyParser.urlencoded({ limit: MAXIMUM_UPLOAD_SIZE, extended: true }),
  );

  await app.listen(PORT);
}

bootstrap();
