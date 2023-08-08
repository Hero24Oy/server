import { Module } from '@nestjs/common';

import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQLContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { SellerContext } from './seller.context';

@Module({
  imports: [
    FirebaseModule,
    GraphQLContextManagerModule.forFeature({
      imports: [SellerModule],
      contexts: [SellerContext],
    }),
  ],
  providers: [SellerResolver, SellerService],
  exports: [SellerService],
})
export class SellerModule {}
