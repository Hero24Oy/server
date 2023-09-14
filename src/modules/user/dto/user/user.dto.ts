import { Field, Float, ObjectType } from '@nestjs/graphql';
import { UserDB } from 'hero24-types';

import { UserDataDto } from './user-data.dto';
import { UserOfferDto } from './user-offer.dto';

import { MaybeType } from '$modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class UserDto {
  @Field(() => String)
  id: string;

  @Field(() => UserDataDto)
  data: UserDataDto;

  @Field(() => String, { nullable: true })
  stripeCustomerId?: MaybeType<string>;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isAdmin?: MaybeType<boolean>;

  @Field(() => Float, { nullable: true })
  netvisorCustomerId?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  netvisorSellerId?: MaybeType<number>;

  @Field(() => Boolean, { nullable: true })
  phoneVerified?: MaybeType<boolean>;

  @Field(() => [UserOfferDto], { nullable: true })
  offers?: MaybeType<UserOfferDto[]>;

  @Field(() => [String], { nullable: true })
  offerRequests?: MaybeType<string[]>;

  @Field(() => [String], { nullable: true })
  transactions?: MaybeType<string[]>;

  @Field(() => [String], { nullable: true })
  paymentTransactions?: MaybeType<string[]>;

  @Field(() => Boolean, { nullable: true })
  hasBuyerProfile?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  hasSellerProfile?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isApprovedSeller?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isBlocked?: MaybeType<boolean>;

  @Field(() => [String], { nullable: true })
  mergedUsers?: MaybeType<string[]>;

  @Field(() => String, { nullable: true })
  mergedTo?: MaybeType<string>;

  // We don't need to send hubSpotContactId on client for now. Only for internal usage
  hubSpotContactId?: MaybeType<string>;

  static adapter: FirebaseAdapter<
    UserDB & { id: string; hubSpotContactId?: string },
    UserDto
  >;
}

UserDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    data: UserDataDto.adapter.toExternal(internal.data),
    stripeCustomerId: internal.stripeCustomerId,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    isAdmin: internal.isAdmin,
    netvisorCustomerId: internal.netvisorCustomerId,
    netvisorSellerId: internal.netvisorSellerId,
    phoneVerified: internal.phoneVerified,
    offers:
      internal.offers &&
      (UserOfferDto.adapter.toExternal(internal.offers) as UserOfferDto[]),
    offerRequests:
      internal.offerRequests &&
      convertFirebaseMapToList(internal.offerRequests),
    transactions:
      internal.transactions && convertFirebaseMapToList(internal.transactions),
    paymentTransactions:
      internal.paymentTransactions &&
      convertFirebaseMapToList(internal.paymentTransactions),
    hasBuyerProfile: internal.hasBuyerProfile,
    hasSellerProfile: internal.hasSellerProfile,
    isApprovedSeller: internal.isApprovedSeller,
    isBlocked: internal.isBlocked,
    mergedUsers:
      internal.mergedUsers && convertFirebaseMapToList(internal.mergedUsers),
    mergedTo: internal.mergedTo,
    hubSpotContactId: internal.hubSpotContactId,
  }),
  toInternal: (external) => ({
    id: external.id,
    data: UserDataDto.adapter.toInternal(external.data),
    stripeCustomerId: external.stripeCustomerId ?? undefined,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    isAdmin: external.isAdmin ?? undefined,
    netvisorCustomerId: external.netvisorCustomerId ?? undefined,
    netvisorSellerId: external.netvisorSellerId ?? undefined,
    phoneVerified: external.phoneVerified ?? undefined,
    offers: external.offers
      ? (UserOfferDto.adapter.toInternal(external.offers) as UserDB['offers'])
      : undefined,
    offerRequests: external.offerRequests
      ? convertListToFirebaseMap(external.offerRequests)
      : undefined,
    transactions: external.transactions
      ? convertListToFirebaseMap(external.transactions)
      : undefined,
    paymentTransactions: external.paymentTransactions
      ? convertListToFirebaseMap(external.paymentTransactions)
      : undefined,
    hasBuyerProfile: external.hasBuyerProfile ?? undefined,
    hasSellerProfile: external.hasSellerProfile ?? undefined,
    isApprovedSeller: external.isApprovedSeller ?? undefined,
    isBlocked: external.isBlocked ?? undefined,
    mergedUsers: external.mergedUsers
      ? convertListToFirebaseMap(external.mergedUsers)
      : undefined,
    mergedTo: external.mergedTo ?? undefined,
    hubSpotContactId: external.hubSpotContactId ?? undefined,
  }),
});
