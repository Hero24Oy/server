import { Field, ObjectType } from '@nestjs/graphql';
import { CustomerProfile, MangoPayCustomer } from 'hero24-types';

import { BuyerProfileDataDto } from './buyer-profile-data.dto';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';
import {
  MangopayCustomerObject,
  MangopayCustomerObjectAdapter,
} from '$modules/mangopay/graphql';

@ObjectType()
export class BuyerProfileDto {
  @Field(() => String)
  id: string;

  @Field(() => BuyerProfileDataDto)
  data: BuyerProfileDataDto;

  @Field(() => Boolean, { nullable: true })
  hasMadeApprovedRequest?: MaybeType<boolean>;

  @Field(() => MangopayCustomerObject, { nullable: true })
  mangopay?: MaybeType<MangopayCustomerObject>;

  static adapter: FirebaseAdapter<
    CustomerProfile & { id: string },
    BuyerProfileDto
  >;
}

BuyerProfileDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    hasMadeApprovedRequest: internal.hasMadeApprovedRequest,
    data: BuyerProfileDataDto.adapter.toExternal(internal.data),
    mangopay: internal.mangopay
      ? (MangopayCustomerObjectAdapter.toExternal(
          internal.mangopay,
        ) as MangopayCustomerObject)
      : undefined,
  }),
  toInternal: (external) => ({
    id: external.id,
    mangopay: external.mangopay
      ? (MangopayCustomerObjectAdapter.toInternal(
          external.mangopay,
        ) as MangoPayCustomer)
      : undefined,
    hasMadeApprovedRequest: external.hasMadeApprovedRequest ?? undefined,
    data: BuyerProfileDataDto.adapter.toInternal(external.data),
  }),
});
