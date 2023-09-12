/* eslint-disable @typescript-eslint/naming-convention */
import { registerEnumType } from '@nestjs/graphql';
import { FeeStatus as FeeStatusType } from 'hero24-types';

export const FeeStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} satisfies Record<Uppercase<FeeStatusType>, FeeStatusType>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FeeStatus = FeeStatusType;

registerEnumType(FeeStatus, {
  name: 'FeeStatus',
});
