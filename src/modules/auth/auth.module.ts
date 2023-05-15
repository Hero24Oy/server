import { Module } from '@nestjs/common';

import { GraphQLContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthContext } from './auth.context';
import { AuthService } from './auth.service';

@Module({
  imports: [
    FirebaseModule,
    GraphQLContextManagerModule.forFeature({
      contexts: [AuthContext],
      imports: [AuthModule],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
