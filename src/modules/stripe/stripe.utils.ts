import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export const initializeStripe = (configService: ConfigService) => {
  const apiVersion = configService.getOrThrow<any>('stripe.apiVersion');
  const apiKey = configService.getOrThrow<string>('stripe.privateKey');

  return new Stripe(apiKey, { apiVersion });
};
