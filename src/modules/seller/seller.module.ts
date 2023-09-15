import { Module } from '@nestjs/common';

import { FirebaseModule } from '../firebase/firebase.module';
import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';

import { SellerContext } from './seller.context';
import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';

@Module({
  imports: [
    FirebaseModule,
    GraphQlContextManagerModule.forFeature({
      imports: [SellerModule],
      contexts: [SellerContext],
    }),
  ],
  providers: [SellerResolver, SellerService],
  exports: [SellerService],
})
export class SellerModule {}
