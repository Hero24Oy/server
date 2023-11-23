import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import { ImageResolver } from './image.resolver';
import { ImageService } from './service';

@Module({
  imports: [FirebaseModule, GraphQlPubsubModule],
  providers: [ImageService, ImageResolver],
  exports: [ImageService],
})
export class ImageModule {}
