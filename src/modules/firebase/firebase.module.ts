import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FirebaseAppService } from './firebase.app.service';
import { FirebaseInterceptor } from './firebase.interceptor';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService, FirebaseAppService, FirebaseInterceptor],
  exports: [FirebaseInterceptor, FirebaseService],
})
export class FirebaseModule {}
