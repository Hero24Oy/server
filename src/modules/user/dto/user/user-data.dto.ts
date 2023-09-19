import { Field, ObjectType } from '@nestjs/graphql';
import { Address, SupportedLanguages, UserDB } from 'hero24-types';
import isNumber from 'lodash/isNumber';

import { UserDataActiveRouteDto } from './user-data-active-route.dto';
import { UserDataAddressDto } from './user-data-address.dto';

import { MaybeType } from '$modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class UserDataDto {
  @Field(() => String)
  email: string;

  @Field(() => Boolean, { nullable: true })
  emailVerified?: MaybeType<boolean>;

  @Field(() => [String], { nullable: true })
  pushToken?: MaybeType<string[]>;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  firstName?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  lastName?: MaybeType<string>;

  @Field(() => String)
  photoURL: string;

  @Field(() => String, { nullable: true })
  language?: MaybeType<string>;

  @Field(() => Boolean, { nullable: true })
  isActive?: MaybeType<boolean>;

  @Field(() => UserDataActiveRouteDto, { nullable: true })
  activeRoute?: MaybeType<UserDataActiveRouteDto>;

  @Field(() => [UserDataAddressDto], { nullable: true })
  addresses?: MaybeType<UserDataAddressDto[]>;

  @Field(() => String, { nullable: true }) // Todo: UserDB['data']['phone'] = string | undefined
  phone?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  iban?: MaybeType<string>;

  @Field(() => Date, { nullable: true })
  birthDate?: MaybeType<Date>;

  @Field(() => String, { nullable: true })
  certificate?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  insurance?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  ssn?: MaybeType<string>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: MaybeType<Date>;

  @Field(() => Date, { nullable: true })
  deletedAt?: MaybeType<Date>;

  @Field(() => Boolean, { nullable: true })
  hasAccountMergeBeenAsked?: MaybeType<boolean>;

  @Field(() => String, { nullable: true })
  selectedAppLanguage?: MaybeType<SupportedLanguages>;

  @Field(() => Date, { nullable: true })
  lastAskedReviewTime?: MaybeType<Date>;

  static adapter: FirebaseAdapter<UserDB['data'], UserDataDto>;
}

UserDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    email: internal.email,
    emailVerified: internal.emailVerified,
    pushToken:
      internal.pushToken && convertFirebaseMapToList(internal.pushToken),
    name: internal.name,
    firstName: internal.firstName,
    lastName: internal.lastName,
    photoURL: internal.photoURL,
    language: internal.language,
    isActive: internal.isActive,
    activeRoute:
      internal.activeRoute &&
      UserDataActiveRouteDto.adapter.toExternal(internal.activeRoute),
    addresses:
      internal.addresses &&
      (UserDataAddressDto.adapter.toExternal(
        internal.addresses,
      ) as UserDataAddressDto[]),
    phone: internal.phone,
    iban: internal.iban,
    birthDate: isNumber(internal.birthDate)
      ? new Date(internal.birthDate)
      : null,
    certificate: internal.certificate,
    insurance: internal.insurance,
    ssn: internal.ssn,
    createdAt: new Date(internal.createdAt),
    updatedAt: isNumber(internal.updatedAt)
      ? new Date(internal.updatedAt)
      : null,
    deletedAt: isNumber(internal.deletedAt)
      ? new Date(internal.deletedAt)
      : null,
    hasAccountMergeBeenAsked: internal.hasAccountMergeBeenAsked,
    selectedAppLanguage: internal.selectedAppLanguage,
    lastAskedReviewTime: isNumber(internal.lastAskedReviewTime)
      ? new Date(internal.lastAskedReviewTime)
      : null,
  }),
  toInternal: (external) => ({
    email: external.email,
    emailVerified: external.emailVerified ?? false,
    pushToken: external.pushToken
      ? convertListToFirebaseMap(external.pushToken)
      : undefined,
    name: external.name,
    firstName: external.firstName ?? undefined,
    lastName: external.lastName ?? undefined,
    photoURL: external.photoURL,
    language: external.language || '',
    isActive: external.isActive ?? undefined,
    activeRoute: external.activeRoute
      ? UserDataActiveRouteDto.adapter.toInternal(external.activeRoute)
      : undefined,
    addresses: external.addresses
      ? (UserDataAddressDto.adapter.toInternal(external.addresses) as Record<
          string,
          Address
        >)
      : undefined,
    phone: external.phone || '',
    iban: external.iban ?? undefined,
    birthDate: external.birthDate ? Number(external.birthDate) : undefined,
    certificate: external.certificate ?? undefined,
    insurance: external.insurance ?? undefined,
    ssn: external.ssn ?? undefined,
    createdAt: Number(external.createdAt),
    updatedAt: external.updatedAt ? Number(external.updatedAt) : undefined,
    deletedAt: external.deletedAt ? Number(external.deletedAt) : undefined,
    hasAccountMergeBeenAsked: external.hasAccountMergeBeenAsked ?? undefined,
    selectedAppLanguage: external.selectedAppLanguage ?? undefined,
    lastAskedReviewTime: external.lastAskedReviewTime
      ? Number(external.lastAskedReviewTime)
      : undefined,
  }),
});
