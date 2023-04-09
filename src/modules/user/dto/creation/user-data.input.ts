import { Field, InputType } from '@nestjs/graphql';
import { SupportedLanguages, UserDB } from 'hero24-types';
import { UserDataActiveRouteInput } from './user-data-active-route.input';
import { UserDataAddressInput } from './user-data-address.input';
import {
  convertListToFirebaseMap,
  omitUndefined,
} from 'src/modules/common/common.utils';
import { serverTimestamp } from 'firebase/database';

@InputType()
export class UserDataInput {
  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  emailVerified: boolean;

  @Field(() => [String], { nullable: true })
  pushToken?: string[];

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String)
  photoURL: string;

  @Field(() => String)
  language: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => UserDataActiveRouteInput, { nullable: true })
  activeRoute?: UserDataActiveRouteInput;

  @Field(() => [UserDataAddressInput], { nullable: true })
  addresses?: UserDataAddressInput[];

  @Field(() => String)
  phone: string;

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

  static convertToFirebaseType(data: UserDataInput): UserDB['data'] {
    return omitUndefined({
      ...data,
      lastAskedReviewTime: data.lastAskedReviewTime
        ? +data.lastAskedReviewTime
        : undefined,
      createdAt: serverTimestamp() as unknown as number,
      pushToken: data.pushToken
        ? convertListToFirebaseMap(data.pushToken)
        : undefined,
      addresses: data.addresses
        ? Object.fromEntries(
            data.addresses.map(({ key, address }) => [key, address]),
          )
        : undefined,
      birthDate: data.birthDate ? +data.birthDate : undefined,
    });
  }
}
