import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Address, UserDB } from 'hero24-types';
import { isNumber } from 'lodash';

import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { convertListToFirebaseMap } from 'src/modules/common/common.utils';

import { UserDataDto } from '../user/user-data.dto';
import { UserDataAddressDto } from '../user/user-data-address.dto';
import { UserDataActiveRouteDto } from '../user/user-data-active-route.dto';

const OMITTED_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'] as const;

@InputType()
export class PartialUserDataInput extends PartialType(
  OmitType(UserDataDto, OMITTED_FIELDS, InputType),
) {
  static adapter: FirebaseAdapter<
    Partial<Pick<UserDB['data'], keyof PartialUserDataInput>>,
    PartialUserDataInput
  >;
}

PartialUserDataInput.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    activeRoute:
      internal.activeRoute &&
      UserDataActiveRouteDto.adapter.toExternal(internal.activeRoute),
    addresses:
      internal.addresses &&
      (UserDataAddressDto.adapter.toExternal(
        internal.addresses,
      ) as UserDataAddressDto[]),
    birthDate: isNumber(internal.birthDate)
      ? new Date(internal.birthDate)
      : null,
    certificate: internal.certificate,
    email: internal.email,
    emailVerified: internal.emailVerified,
    firstName: internal.firstName,
    hasAccountMergeBeenAsked: internal.hasAccountMergeBeenAsked,
    iban: internal.iban,
    insurance: internal.insurance,
    isActive: internal.isActive,
    language: internal.language,
    lastAskedReviewTime: isNumber(internal.lastAskedReviewTime)
      ? new Date(internal.lastAskedReviewTime)
      : null,
    lastName: internal.lastName,
    name: internal.name,
    phone: internal.phone,
    photoURL: internal.photoURL,
    pushToken: internal.pushToken ? Object.keys(internal.pushToken) : null,
    selectedAppLanguage: internal.selectedAppLanguage,
    ssn: internal.ssn,
  }),
  toInternal: (external) => ({
    activeRoute: external.activeRoute
      ? UserDataActiveRouteDto.adapter.toInternal(external.activeRoute)
      : undefined,
    addresses: external.addresses
      ? (UserDataAddressDto.adapter.toInternal(external.addresses) as Record<
          string,
          Address
        >)
      : undefined,
    birthDate: external.birthDate ? Number(external.birthDate) : undefined,
    certificate: external.certificate ?? undefined,
    email: external.email ?? undefined,
    emailVerified: external.emailVerified ?? undefined,
    firstName: external.firstName ?? undefined,
    hasAccountMergeBeenAsked: external.hasAccountMergeBeenAsked ?? undefined,
    iban: external.iban ?? undefined,
    insurance: external.insurance ?? undefined,
    isActive: external.isActive ?? undefined,
    language: external.language ?? undefined,
    lastAskedReviewTime: external.lastAskedReviewTime
      ? Number(external.lastAskedReviewTime)
      : undefined,
    lastName: external.lastName ?? undefined,
    name: external.name ?? undefined,
    phone: external.phone ?? undefined,
    photoURL: external.photoURL ?? undefined,
    pushToken: external.pushToken
      ? convertListToFirebaseMap(external.pushToken)
      : undefined,
    selectedAppLanguage: external.selectedAppLanguage ?? undefined,
    ssn: external.ssn ?? undefined,
  }),
});
