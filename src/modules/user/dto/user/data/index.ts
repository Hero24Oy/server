import { Field, ObjectType } from '@nestjs/graphql';
import { SupportedLanguages, UserDB } from 'hero24-types';
import { Address } from '../address';
import { UserDataActiveRoute } from './active-route';
import { UserDataAddress } from './address';

type RedefinedUserDBDataFields =
  | 'pushToken'
  | 'addresses'
  | 'lastAskedReviewTime'
  | 'birthDate'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';

type GraphQLUserDBData = Omit<UserDB['data'], RedefinedUserDBDataFields> & {
  pushToken?: string[];
  addresses?: Array<{ key: string; address: Address }>;
  lastAskedReviewTime?: Date;
  birthDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

@ObjectType()
export class UserDataDto implements GraphQLUserDBData {
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

  @Field(() => UserDataActiveRoute, { nullable: true })
  activeRoute?: UserDataActiveRoute;

  @Field(() => [UserDataAddress], { nullable: true })
  addresses?: UserDataAddress[];

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
