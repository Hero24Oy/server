import { InputType, OmitType } from '@nestjs/graphql';
import { Address, UserDB } from 'hero24-types';

import { UserDataDto } from '../user/user-data.dto';
import { UserDataActiveRouteDto } from '../user/user-data-active-route.dto';
import { UserDataAddressDto } from '../user/user-data-address.dto';

import { isNumber } from '$imports/lodash';
import { convertListToFirebaseMap } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

const omittedFields = [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'lastAskedReviewTime',
] as const;

@InputType()
export class UserDataInput extends OmitType(
  UserDataDto,
  omittedFields,
  InputType,
) {
  static adapter: FirebaseAdapter<
    Pick<UserDB['data'], keyof UserDataInput>,
    UserDataInput
  >;
}

UserDataInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    email: internal.email,
    emailVerified: internal.emailVerified,
    pushToken: internal.pushToken && Object.keys(internal.pushToken),
    name: internal.name,
    firstName: internal.firstName,
    lastName: internal.lastName,
    photoURL: internal.photoURL,
    language: internal.language,
    isActive: internal.isActive,
    activeRoute:
      internal.activeRoute &&
      UserDataActiveRouteDto.adapter.toInternal(internal.activeRoute),
    addresses: internal.addresses
      ? (UserDataAddressDto.adapter.toExternal(
          internal.addresses,
        ) as UserDataAddressDto[])
      : null,
    phone: internal.phone,
    iban: internal.iban,
    birthDate: isNumber(internal.birthDate)
      ? new Date(internal.birthDate)
      : null,
    certificate: internal.certificate,
    insurance: internal.insurance,
    ssn: internal.ssn,
    hasAccountMergeBeenAsked: internal.hasAccountMergeBeenAsked,
    selectedAppLanguage: internal.selectedAppLanguage,
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
    language: external.language ?? '',
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
    phone: external.phone ?? '',
    iban: external.iban ?? undefined,
    birthDate: external.birthDate ? Number(external.birthDate) : undefined,
    certificate: external.certificate ?? undefined,
    insurance: external.insurance ?? undefined,
    ssn: external.ssn ?? undefined,
    hasAccountMergeBeenAsked: external.hasAccountMergeBeenAsked ?? undefined,
    selectedAppLanguage: external.selectedAppLanguage ?? undefined,
  }),
});
