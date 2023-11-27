import { registerEnumType } from '@nestjs/graphql';
import { PaymentTransactionStatus } from 'hero24-types';

export const paymentTransactionStatusEnum = registerEnumType(
  PaymentTransactionStatus,
  {
    name: 'PaymentTransactionStatus',
  },
);
