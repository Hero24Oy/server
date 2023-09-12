import { registerEnumType } from '@nestjs/graphql';
import { FeeStatus as FeeStatusType } from 'hero24-types';

export const FeeStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} satisfies Record<Uppercase<FeeStatusType>, FeeStatusType>;

export type FeeStatus = FeeStatusType;

registerEnumType(FeeStatus, {
  name: 'FeeStatus',
});
