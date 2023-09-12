import { Field, ObjectType } from '@nestjs/graphql';
import { Address, SupportedLanguages } from 'hero24-types';
import { isNumber } from 'lodash';
import { MaybeType } from 'src/modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { UserDbWithPartialData } from '../../user.types';

import { UserDataActiveRouteDto } from './user-data-active-route.dto';
import { UserDataAddressDto } from './user-data-address.dto';

@ObjectType()
export class UserDataDto {
  @Field(() => String, { nullable: true })
  email: MaybeType<string>;

  @Field(() => Boolean, { nullable: true })
  emailVerified?: MaybeType<boolean>;

  @Field(() => [String], { nullable: true })
  pushToken?: MaybeType<string[]>;

  @Field(() => String, { nullable: true })
  name: MaybeType<string>;

  @Field(() => String, { nullable: true })
  firstName?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  lastName?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  photoURL: MaybeType<string>;

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

  @Field(() => Date, { nullable: true })
  createdAt: MaybeType<Date>;

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

  static adapter: FirebaseAdapter<UserDbWithPartialData['data'], UserDataDto>;
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
    createdAt: new Date(internal.createdAt ?? 0),
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
    email: external.email ?? undefined,
    emailVerified: external.emailVerified ?? false,
    pushToken: external.pushToken
      ? convertListToFirebaseMap(external.pushToken)
      : undefined,
    name: external.name ?? undefined,
    firstName: external.firstName ?? undefined,
    lastName: external.lastName ?? undefined,
    photoURL: external.photoURL ?? undefined,
    language: external.language || undefined,
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
    phone: external.phone || undefined,
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
