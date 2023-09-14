import { Field, ObjectType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';

import { BuyerProfileDataDto } from './buyer-profile-data.dto';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class BuyerProfileDto {
  @Field(() => String)
  id: string;

  @Field(() => BuyerProfileDataDto)
  data: BuyerProfileDataDto;

  @Field(() => Boolean, { nullable: true })
  hasMadeApprovedRequest?: MaybeType<boolean>;

  static adapter: FirebaseAdapter<
    BuyerProfileDB & { id: string },
    BuyerProfileDto
  >;
}

BuyerProfileDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    hasMadeApprovedRequest: internal.hasMadeApprovedRequest,
    data: BuyerProfileDataDto.adapter.toExternal(internal.data),
  }),
  toInternal: (external) => ({
    id: external.id,
    hasMadeApprovedRequest: external.hasMadeApprovedRequest ?? undefined,
    data: BuyerProfileDataDto.adapter.toInternal(external.data),
  }),
});
