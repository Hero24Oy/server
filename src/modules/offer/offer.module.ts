import { Module } from '@nestjs/common';

import { OfferService } from './offer.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [OfferService],
})
export class OfferModule {}
