import { Field, InputType } from '@nestjs/graphql';
import { SupportedLanguages, UserDB } from 'hero24-types';
import { PartialUserDataActiveRouteInput } from './partial-user-data-active-route.input';
import { PartialUserDataAddressInput } from './partial-user-data-address.input';
import {
  convertListToFirebaseMap,
  omitUndefined,
} from 'src/modules/common/common.utils';
import { serverTimestamp } from 'firebase/database';

@InputType()
export class PartialUserDataInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Boolean, { nullable: true })
  emailVerified?: boolean;

  @Field(() => [String], { nullable: true })
  pushToken?: string[];

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  photoURL?: string;

  @Field(() => String, { nullable: true })
  language?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => PartialUserDataActiveRouteInput, { nullable: true })
  activeRoute?: PartialUserDataActiveRouteInput;

  @Field(() => [PartialUserDataAddressInput], { nullable: true })
  addresses?: PartialUserDataAddressInput[];

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  iban?: string;

  @Field(() => Date, { nullable: true })
  birthDate?: Date;

  @Field(() => String, { nullable: true })
  certificate?: string;

  @Field(() => String, { nullable: true })
  insurance?: string;

  @Field(() => String, { nullable: true })
  ssn?: string;

  @Field(() => Boolean, { nullable: true })
  hasAccountMergeBeenAsked?: boolean;

  @Field(() => String, { nullable: true })
  selectedAppLanguage?: SupportedLanguages;

  @Field(() => Date, { nullable: true })
  lastAskedReviewTime?: Date;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  static convertToFirebaseType(
    data: PartialUserDataInput,
  ): Partial<UserDB['data']> {
    return omitUndefined({
      email: data.email,
      emailVerified: data.emailVerified,
      pushToken: data.pushToken && convertListToFirebaseMap(data.pushToken),
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      photoURL: data.photoURL,
      language: data.language,
      isActive: data.isActive,
      activeRoute: data.activeRoute,
      addresses:
        data.addresses &&
        Object.fromEntries(
          data.addresses.map(({ key, address }) => [key, address]),
        ),
      phone: data.phone,
      iban: data.iban,
      birthDate: data.birthDate && +data.birthDate,
      certificate: data.certificate,
      insurance: data.insurance,
      ssn: data.ssn,
      hasAccountMergeBeenAsked: data.hasAccountMergeBeenAsked,
      selectedAppLanguage: data.selectedAppLanguage,
      lastAskedReviewTime:
        data.lastAskedReviewTime && +data.lastAskedReviewTime,
      createdAt: data.createdAt && +data.createdAt,
      updatedAt: serverTimestamp() as unknown as number,
    });
  }
}
