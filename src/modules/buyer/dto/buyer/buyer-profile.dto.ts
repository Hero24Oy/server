import { Field, ObjectType } from '@nestjs/graphql';
import { CustomerProfile } from 'hero24-types';

import { BuyerProfileDataDto } from './buyer-profile-data.dto';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';
import { MangopayCustomerObject } from '$modules/mangopay/graphql';

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
    mangopay: internal.mangopay,
  }),
  toInternal: (external) => ({
    id: external.id,
    mangopay: external.mangopay ?? undefined,
    hasMadeApprovedRequest: external.hasMadeApprovedRequest ?? undefined,
    data: BuyerProfileDataDto.adapter.toInternal(external.data),
  }),
});
