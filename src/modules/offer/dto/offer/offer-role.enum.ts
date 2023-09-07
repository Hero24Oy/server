import { registerEnumType } from '@nestjs/graphql';

export enum OfferRole {
  CUSTOMER = 'buyer',
  SELLER = 'seller',
}

registerEnumType(OfferRole, {
  name: 'OfferRole',
});
