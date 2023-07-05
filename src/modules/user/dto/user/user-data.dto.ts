import { Field, ObjectType } from '@nestjs/graphql';
import { SupportedLanguages } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';

import { UserDataAddressDto } from './user-data-address.dto';
import { UserDataActiveRouteDto } from './user-data-active-route.dto';

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
  activeRoute?: UserDataActiveRouteDto;

  @Field(() => [UserDataAddressDto], { nullable: true })
  addresses?: UserDataAddressDto[];

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
}
