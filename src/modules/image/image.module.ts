import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import { ImageService } from './image.service';
import { ImageResolver } from './image.resolver';

@Module({
  imports: [FirebaseModule, GraphQLPubsubModule],
  providers: [ImageService, ImageResolver],
  exports: [ImageService],
})
export class ImageModule {}
