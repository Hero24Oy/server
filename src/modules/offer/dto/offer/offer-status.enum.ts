import { registerEnumType } from '@nestjs/graphql';

export enum OfferStatus {
  OPEN = 'open',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

registerEnumType(OfferStatus, {
  name: 'OfferStatus',
});
