import { Module } from '@nestjs/common';
import { BuyerResolver } from './buyer.resolver';
import { BuyerService } from './buyer.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [BuyerResolver, BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
