import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { CustomerProfileDataDB } from '$modules/buyer/customer.types';
import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export enum CustomerType {
  INDIVIDUAL = 'individual',
  PROFESSIONAL = 'professional',
}

// TODO remove when types package is updated
registerEnumType(CustomerType, {
  name: 'CustomerType',
});

// TODO add validation based on other fields for businessId and businessName
@ObjectType()
@InputType('BuyerProfileDataInput')
export class BuyerProfileDataDto {
  @Field(() => String)
  displayName: string;

  @Field(() => String, { nullable: true })
  photoURL?: MaybeType<string>;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: MaybeType<boolean>;

  // TODO make nullable as well
  @Field(() => CustomerType)
  type: `${CustomerType}`;

  @Field(() => String, {
    nullable: true,
  })
  businessId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  businessName?: MaybeType<string>;

  static adapter: FirebaseAdapter<CustomerProfileDataDB, BuyerProfileDataDto>;
}

BuyerProfileDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
    // * treat customer as individual if it' not defined (legacy)
    type: internal.type ?? CustomerType.INDIVIDUAL,
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
