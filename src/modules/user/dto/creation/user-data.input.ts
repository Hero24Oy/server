import { Field, InputType } from '@nestjs/graphql';
import { SupportedLanguages } from 'hero24-types';
import { UserDataActiveRouteInput } from './user-data-active-route.input';
import { UserDataAddressInput } from './user-data-address.input';

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
}
