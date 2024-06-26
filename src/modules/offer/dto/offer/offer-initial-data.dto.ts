import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferDB } from 'hero24-types';

import { PurchaseDto } from './purchase.dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class OfferInitialDataDto {
  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  buyerProfileId: string;

  @Field(() => String)
  sellerProfileId: string;

  @Field(() => String)
  offerRequestId: string;

  @Field(() => Date)
  agreedStartTime: Date;

  @Field(() => PurchaseDto)
  purchase: PurchaseDto;

  @Field(() => Float)
  pricePerHour: number;

  static adapter: FirebaseAdapter<
    OfferDB['data']['initial'],
    OfferInitialDataDto
  >;
}

OfferInitialDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    createdAt: new Date(internal.createdAt),
    buyerProfileId: internal.buyerProfile,
    sellerProfileId: internal.sellerProfile,
    offerRequestId: internal.offerRequest,
    agreedStartTime: new Date(internal.agreedStartTime),
    purchase: PurchaseDto.adapter.toExternal(internal.purchase),
    pricePerHour: internal.pricePerHour,
  }),
  toInternal: (internal) => ({
    createdAt: Number(internal.createdAt),
    buyerProfile: internal.buyerProfileId,
    sellerProfile: internal.sellerProfileId,
    offerRequest: internal.offerRequestId,
    agreedStartTime: Number(internal.agreedStartTime),
    purchase: PurchaseDto.adapter.toInternal(internal.purchase),
    pricePerHour: internal.pricePerHour,
  }),
});
