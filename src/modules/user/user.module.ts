import { Module } from '@nestjs/common';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';
import { UserHubSpotModule } from './user-hub-spot/user-hub-spot.module';

@Module({
  imports: [FirebaseModule, GraphQLPubsubModule, UserHubSpotModule],
  providers: [UserResolver, UserService],
  exports: [UserService, UserHubSpotModule],
})
export class UserModule {}
