import { Module } from '@nestjs/common';

import { TransactionResolver } from './resolver';
import { TransactionService } from './service';

import { FirebaseModule } from '$modules/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [TransactionService, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
