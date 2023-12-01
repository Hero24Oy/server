import { registerEnumType } from '@nestjs/graphql';
import { PaymentTransactionType } from 'hero24-types';

export const paymentTransactionTypeEnum = registerEnumType(
  PaymentTransactionType,
  {
    name: 'PaymentTransactionType',
  },
);
