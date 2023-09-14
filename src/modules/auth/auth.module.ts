import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';

import { AuthContext } from './auth.context';
import { AuthService } from './auth.service';

@Module({
  imports: [
    FirebaseModule,
    GraphQlContextManagerModule.forFeature({
      contexts: [AuthContext],
      imports: [AuthModule],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
