import { Field, ObjectType } from '@nestjs/graphql';
import { UserDataAddressDto } from './user-data-address.dto';
import { UserDataActiveRouteDto } from './user-data-active-route.dto';
import { SupportedLanguages } from 'hero24-types';

@ObjectType()
export class UserDataDto {
  @Field(() => String)
  email: string;

  @Field(() => Boolean, { nullable: true })
  emailVerified?: boolean;

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

  @Field(() => String, { nullable: true })
  language?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => UserDataActiveRouteDto, { nullable: true })
  activeRoute?: UserDataActiveRouteDto;

  @Field(() => [UserDataAddressDto], { nullable: true })
  addresses?: UserDataAddressDto[];

  @Field(() => String, { nullable: true }) // Todo: UserDB['data']['phone'] = string | undefined
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

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Boolean, { nullable: true })
  hasAccountMergeBeenAsked?: boolean;

  @Field(() => String, { nullable: true })
  selectedAppLanguage?: SupportedLanguages;

  @Field(() => Date, { nullable: true })
  lastAskedReviewTime?: Date;
}
