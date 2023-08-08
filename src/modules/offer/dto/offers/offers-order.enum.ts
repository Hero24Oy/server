import { registerEnumType } from '@nestjs/graphql';

export enum OfferOrderColumn {
  ID = 'id',
  STATUS = 'status',
}

registerEnumType(OfferOrderColumn, {
  name: 'OfferOrderColumn',
});
