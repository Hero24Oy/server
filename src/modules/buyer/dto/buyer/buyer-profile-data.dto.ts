import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';

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
  type: CustomerType;

  static adapter: FirebaseAdapter<
    BuyerProfileDB['data'] & { type: CustomerType },
    BuyerProfileDataDto
  >;
}

BuyerProfileDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
    type: internal.type,
  }),
  toInternal: (external) => ({
    displayName: external.displayName,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
    type: external.type,
  }),
});
