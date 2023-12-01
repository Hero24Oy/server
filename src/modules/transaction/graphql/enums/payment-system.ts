import { registerEnumType } from '@nestjs/graphql';
import { PaymentSystem } from 'hero24-types';

export const paymentSystemEnum = registerEnumType(PaymentSystem, {
  name: 'PaymentSystem',
});
