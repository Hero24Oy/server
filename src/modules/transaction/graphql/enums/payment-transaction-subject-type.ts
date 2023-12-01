import { registerEnumType } from '@nestjs/graphql';
import { PaymentTransactionSubjectType } from 'hero24-types';

export const paymentTransactionSubjectTypeEnum = registerEnumType(
  PaymentTransactionSubjectType,
  {
    name: 'PaymentTransactionSubjectType',
  },
);
