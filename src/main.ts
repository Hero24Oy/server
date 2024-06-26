import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';

import { MAXIMUM_UPLOAD_SIZE } from './app.constants';
import { AppModule } from './app.module';
import { CONFIG_PROVIDER, ConfigType } from './config';
import { FirebaseInterceptor } from './modules/firebase/firebase.interceptor';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigType>(CONFIG_PROVIDER);
  const firebaseInterceptor = app.get(FirebaseInterceptor);

  const { port } = config.app;

  app.useGlobalInterceptors(firebaseInterceptor);

  app.use(bodyParser.json({ limit: MAXIMUM_UPLOAD_SIZE }));
  app.use(
    bodyParser.urlencoded({ limit: MAXIMUM_UPLOAD_SIZE, extended: true }),
  );

  await app.listen(port);
};

void bootstrap();
