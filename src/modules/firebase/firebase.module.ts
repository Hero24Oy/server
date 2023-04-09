import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FirebaseInterceptor } from './firebase.interceptor';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService, FirebaseInterceptor],
  exports: [FirebaseInterceptor],
})
export class FirebaseModule {}
