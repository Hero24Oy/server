import { registerEnumType } from '@nestjs/graphql';

export enum OfferOrderColumn {
  ID = 'id',
  STATUS = 'status',
  START_TIME = 'agreedStartTime',
}

registerEnumType(OfferOrderColumn, {
  name: 'OfferOrderColumn',
});
