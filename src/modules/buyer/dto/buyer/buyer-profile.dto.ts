import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';

import { BuyerProfileDataDto } from './buyer-profile-data.dto';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

// TODO will be removed when types package is updated

export enum CustomerType {
  SELF_EMPLOYED = 'selfEmployed',
  BUSINESS_CUSTOMER = 'businessCustomer',
}

registerEnumType(CustomerType, {
  name: 'CustomerType',
});

@ObjectType()
export class BuyerProfileDto {
  @Field(() => String)
  id: string;

  @Field(() => BuyerProfileDataDto)
  data: BuyerProfileDataDto;

  @Field(() => Boolean, { nullable: true })
  hasMadeApprovedRequest?: MaybeType<boolean>;

  @Field(() => CustomerType)
  type: CustomerType;

  static adapter: FirebaseAdapter<
    BuyerProfileDB & { id: string; type: CustomerType },
    BuyerProfileDto
  >;
}

BuyerProfileDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    hasMadeApprovedRequest: internal.hasMadeApprovedRequest,
    data: BuyerProfileDataDto.adapter.toExternal(internal.data),
    type: internal.type ?? CustomerType.SELF_EMPLOYED,
  }),
  toInternal: (external) => ({
    id: external.id,
    hasMadeApprovedRequest: external.hasMadeApprovedRequest ?? undefined,
    data: BuyerProfileDataDto.adapter.toInternal(external.data),
    type: external.type,
  }),
});
