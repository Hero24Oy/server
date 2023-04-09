import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseInterceptor } from './modules/firebase/firebase.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const firebaseInterceptor = app.get(FirebaseInterceptor);

  const PORT = configService.getOrThrow('app.port');

  app.useGlobalInterceptors(firebaseInterceptor);

  await app.listen(PORT);
}

bootstrap();
