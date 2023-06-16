import { Module } from '@nestjs/common';
import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [SellerResolver, SellerService],
  exports: [SellerService],
})
export class SellerModule {}
