import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDB } from 'hero24-types';
import {
  convertFirebaseMapToList,
  executeIfDefined,
  timestampToDate,
} from 'src/modules/common/common.utils';
import { UserDataDto } from './user-data.dto';
import { UserOfferDto } from './user-offer.dto';

@ObjectType()
export class UserDto {
  @Field(() => String)
  id: string;

  @Field(() => UserDataDto)
  data: UserDataDto;

  @Field(() => String, { nullable: true })
  stripeCustomerId?: string;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: boolean;

  @Field(() => Boolean, { nullable: true })
  isAdmin?: boolean;

  @Field(() => Int, { nullable: true })
  netvisorCustomerId?: number;

  @Field(() => Int, { nullable: true })
  netvisorSellerId?: number;

  @Field(() => Boolean, { nullable: true })
  phoneVerified?: boolean;

  @Field(() => [UserOfferDto], { nullable: true })
  offers?: UserOfferDto[];

  @Field(() => [String], { nullable: true })
  offerRequests?: string[];

  @Field(() => [String], { nullable: true })
  transactions?: string[];

  @Field(() => [String], { nullable: true })
  paymentTransactions?: string[];

  @Field(() => Boolean, { nullable: true })
  hasBuyerProfile?: boolean;

  @Field(() => Boolean, { nullable: true })
  hasSellerProfile?: boolean;

  @Field(() => Boolean, { nullable: true })
  isApprovedSeller?: boolean;

  @Field(() => Boolean, { nullable: true })
  isBlocked?: boolean;

  @Field(() => [String], { nullable: true })
  mergedUsers?: string[];

  @Field(() => String, { nullable: true })
  mergedTo?: string;

  static convertFromFirebaseType(id: string, user: UserDB): UserDto {
    return {
      id,
      ...user,
      data: {
        ...user.data,
        pushToken: convertFirebaseMapToList(user.data.pushToken || {}),
        addresses: Object.entries(user.data.addresses || {}).map(
          ([key, address]) => ({ key, address }),
        ),
        createdAt: new Date(user.data.createdAt),
        updatedAt: executeIfDefined(
          user.data.updatedAt,
          timestampToDate,
          undefined,
        ),
        birthDate: executeIfDefined(
          user.data.birthDate,
          timestampToDate,
          undefined,
        ),
        deletedAt: executeIfDefined(
          user.data.deletedAt,
          timestampToDate,
          undefined,
        ),
        lastAskedReviewTime: executeIfDefined(
          user.data.lastAskedReviewTime,
          timestampToDate,
          undefined,
        ),
      },
      offerRequests: convertFirebaseMapToList(user.offerRequests || {}),
      transactions: convertFirebaseMapToList(user.transactions || {}),
      paymentTransactions: convertFirebaseMapToList(
        user.paymentTransactions || {},
      ),
      mergedUsers: convertFirebaseMapToList(user.mergedUsers || {}),
      offers: Object.entries(user.offers || {}).map(
        ([offerId, { offerRequestId }]) => ({ offerId, offerRequestId }),
      ),
      isBlocked:
        typeof user.isBlocked === 'string'
          ? user.isBlocked === 'true'
          : user.isBlocked,
    };
  }
}
