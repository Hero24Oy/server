import { Field, ObjectType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';

import { BuyerProfileDataDto, CustomerType } from './buyer-profile-data.dto';

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
    BuyerProfileDB & { id: string } & {
      data: {
        type: CustomerType;
      };
    }, // TODO remove after hero24-types updated
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
