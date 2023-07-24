import Stripe from 'stripe';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { initializeStripe } from './stripe.utils';

@Module({
  providers: [
    {
      provide: Stripe,
      useFactory: initializeStripe,
      inject: [ConfigService],
    },
  ],
  exports: [Stripe],
})
export class StripeModule {}
