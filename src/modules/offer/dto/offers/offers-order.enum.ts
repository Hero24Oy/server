import { registerEnumType } from '@nestjs/graphql';

export enum OfferOrderColumn {
  OFFER = 'id',
  STATUS = 'status',
}

registerEnumType(OfferOrderColumn, {
  name: 'OfferOrderColumn',
});
