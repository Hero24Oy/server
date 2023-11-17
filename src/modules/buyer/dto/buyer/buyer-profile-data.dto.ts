import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { CustomerProfileDataDB } from '$modules/buyer/customer.types';
import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

// TODO remove when types package is updated
export enum CustomerType {
  INDIVIDUAL = 'individual',
  PROFESSIONAL = 'professional',
}

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

  @Field(() => CustomerType)
  type: `${CustomerType}`;

  @Field(() => String)
  businessId?: MaybeType<string>;

  @Field(() => String)
  businessName?: MaybeType<string>;

  static adapter: FirebaseAdapter<CustomerProfileDataDB, BuyerProfileDataDto>;
}

BuyerProfileDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
    type: internal.type,
    businessId: internal.businessId ?? null,
    businessName: internal.businessName ?? null,
  }),
  toInternal: (external) => ({
    displayName: external.displayName,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
    type: external.type,
    businessId: external.businessId ?? undefined,
    businessName: external.businessName ?? undefined,
  }),
});
