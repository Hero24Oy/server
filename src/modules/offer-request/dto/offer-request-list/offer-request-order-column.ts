import { registerEnumType } from '@nestjs/graphql';

export enum OfferRequestOrderColumn {
  BUYER = 'buyerProfile',
  CREATED_AT = 'createdAt',
  STATUS = 'status',
}

registerEnumType(OfferRequestOrderColumn, {
  name: 'OfferRequestOrderColumn',
});
