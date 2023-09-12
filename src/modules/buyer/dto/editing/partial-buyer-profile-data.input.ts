import { Field, InputType, OmitType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { BuyerProfileDataDto } from '../buyer/buyer-profile-data.dto';

@InputType()
export class PartialBuyerProfileDataInput extends OmitType(
  BuyerProfileDataDto,
  ['displayName'],
  InputType,
) {
  @Field(() => String, { nullable: true })
  displayName?: MaybeType<string>;

  static adapter: FirebaseAdapter<
    Partial<BuyerProfileDB['data']>,
    PartialBuyerProfileDataInput
  >;
}

PartialBuyerProfileDataInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
  }),
  toInternal: (external) => ({
    displayName: external.displayName ?? undefined,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
  }),
});
