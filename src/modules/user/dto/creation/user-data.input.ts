import { InputType, OmitType } from '@nestjs/graphql';
import { Address } from 'hero24-types';
import { isNumber } from 'lodash';

import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { convertListToFirebaseMap } from 'src/modules/common/common.utils';

import { UserDataActiveRouteDto } from '../user/user-data-active-route.dto';
import { UserDataDto } from '../user/user-data.dto';
import { UserDataAddressDto } from '../user/user-data-address.dto';
import { UserDBWithPartialData } from '../../user.types';

const OMITTED_FIELDS = [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'lastAskedReviewTime',
] as const;

@InputType()
export class UserDataInput extends OmitType(
  UserDataDto,
  OMITTED_FIELDS,
  InputType,
) {
  static adapter: FirebaseAdapter<
    Pick<UserDBWithPartialData['data'], keyof UserDataInput>,
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
    email: external.email ?? undefined,
    emailVerified: external.emailVerified ?? false,
    pushToken: external.pushToken
      ? convertListToFirebaseMap(external.pushToken)
      : undefined,
    name: external.name ?? undefined,
    firstName: external.firstName ?? undefined,
    lastName: external.lastName ?? undefined,
    photoURL: external.photoURL ?? undefined,
    language: external.language ?? undefined,
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
    phone: external.phone ?? undefined,
    iban: external.iban ?? undefined,
    birthDate: external.birthDate ? Number(external.birthDate) : undefined,
    certificate: external.certificate ?? undefined,
    insurance: external.insurance ?? undefined,
    ssn: external.ssn ?? undefined,
    hasAccountMergeBeenAsked: external.hasAccountMergeBeenAsked ?? undefined,
    selectedAppLanguage: external.selectedAppLanguage ?? undefined,
  }),
});
