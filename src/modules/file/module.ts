import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlPubsubModule } from '../graphql-pubsub/graphql-pubsub.module';

import { FileResolver } from './resolver';
import { FileService } from './service';

@Module({
  imports: [FirebaseModule, GraphQlPubsubModule],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export class FileModule {}
