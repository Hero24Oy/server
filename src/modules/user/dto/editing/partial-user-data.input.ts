import { Field, InputType } from '@nestjs/graphql';
import { SupportedLanguages } from 'hero24-types';
import { PartialUserDataActiveRouteInput } from './partial-user-data-active-route.input';
import { PartialUserDataAddressInput } from './partial-user-data-address.input';

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
}
