import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CustomerProfileData, CustomerType } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

registerEnumType(CustomerType, {
  name: 'CustomerType',
});

@ObjectType()
@InputType('BuyerProfileDataInput')
export class BuyerProfileDataDto {
  @Field(() => String)
  displayName: string;

  @Field(() => String, { nullable: true })
  photoURL?: MaybeType<string>;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: MaybeType<boolean>;

  @Field(() => CustomerType, { nullable: true })
  type: MaybeType<`${CustomerType}`>;

  @Field(() => String, {
    nullable: true,
  })
  businessId?: MaybeType<string>;

  static adapter: FirebaseAdapter<CustomerProfileData, BuyerProfileDataDto>;
}

BuyerProfileDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
    type: internal.type ?? null,
    businessId: internal.businessId ?? null,
  }),
  toInternal: (external) => ({
    displayName: external.displayName,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
    type: undefined,
    businessId: undefined,
  }),
});
