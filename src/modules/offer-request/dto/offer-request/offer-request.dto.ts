import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { OfferRequestChatDto } from './offer-request-chat.dto';
import { OfferRequestDataDto } from './offer-request-data.dto';
import { OfferRequestRefundDto } from './offer-request-refund.dto';
import { OfferRequestSubscriptionDto } from './offer-request-subscription.dto';

import { MaybeType } from '$/src/modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from '$/src/modules/common/common.utils';
import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
export class OfferRequestDto {
  @Field(() => String)
  id: string;

  @Field(() => OfferRequestDataDto)
  data: OfferRequestDataDto;

  @Field(() => [OfferRequestChatDto], { nullable: true })
  chats?: MaybeType<OfferRequestChatDto[]>;

  @Field(() => OfferRequestSubscriptionDto, { nullable: true })
  subscription?: MaybeType<OfferRequestSubscriptionDto>;

  @Field(() => String, { nullable: true })
  stripeSubscriptionId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  stripePaymentIntentId?: MaybeType<string>;

  @Field(() => Float, { nullable: true })
  customerVAT?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  serviceProviderVAT?: MaybeType<number>;

  @Field(() => String, { nullable: true })
  netvisorSalesOrderId?: MaybeType<string>;

  @Field(() => Float, { nullable: true })
  netvisorSalesInvoiceNumber?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  minimumDuration?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  sendToNetvisor?: MaybeType<number>;

  @Field(() => Boolean, { nullable: true })
  isApproved?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isApprovedByBuyer?: MaybeType<boolean>;

  @Field(() => [String], { nullable: true })
  offers?: MaybeType<string[]>;

  @Field(() => [String], { nullable: true })
  fees?: MaybeType<string[]>;

  @Field(() => String, { nullable: true })
  paymentParamsId?: MaybeType<string>; // legacy

  @Field(() => String, { nullable: true })
  paymentInfoId?: MaybeType<string>;

  @Field(() => [String], { nullable: true })
  paymentTransactions?: MaybeType<string[]>;

  @Field(() => Boolean, { nullable: true })
  offerRequestChanged?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  offerRrequestChangeAccepted?: MaybeType<boolean>;

  @Field(() => OfferRequestRefundDto, { nullable: true })
  refund?: MaybeType<OfferRequestRefundDto>;

  static adapter: FirebaseAdapter<
    OfferRequestDB & { id: string },
    OfferRequestDto
  >;
}

OfferRequestDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    id: external.id,
    data: OfferRequestDataDto.adapter.toInternal(external.data),
    offers: external.offers
      ? convertListToFirebaseMap(external.offers)
      : undefined,
    fees: external.fees ? convertListToFirebaseMap(external.fees) : undefined,
    paymentTransactions: external.paymentTransactions
      ? convertListToFirebaseMap(external.paymentTransactions)
      : undefined,
    refund: external.refund
      ? OfferRequestRefundDto.adapter.toInternal(external.refund)
      : undefined,
    subscription: external.subscription
      ? OfferRequestSubscriptionDto.adapter.toInternal(external.subscription)
      : undefined,
    chats: external.chats
      ? Object.fromEntries(
          external.chats.map((chat) => [
            chat.sellerProfileId,
            OfferRequestChatDto.adapter.toInternal(chat),
          ]),
        )
      : undefined,
    stripeSubscriptionId: external.stripeSubscriptionId ?? undefined,
    stripePaymentIntentId: external.stripePaymentIntentId ?? undefined,
    customerVAT: external.customerVAT ?? undefined,
    serviceProviderVAT: external.serviceProviderVAT ?? undefined,
    netvisorSalesOrderId: external.netvisorSalesOrderId ?? undefined,
    netvisorSalesInvoiceNumber:
      external.netvisorSalesInvoiceNumber ?? undefined,
    minimumDuration: external.minimumDuration ?? undefined,
    sendToNetvisor: external.sendToNetvisor ?? undefined,
    isApproved: external.isApproved ?? undefined,
    isApprovedByBuyer: external.isApprovedByBuyer ?? undefined,
    paymentParamsId: external.paymentParamsId ?? undefined,
    paymentInfoId: external.paymentInfoId ?? undefined,
    offerRequestChanged: external.offerRequestChanged ?? undefined,
    offerRrequestChangeAccepted:
      external.offerRrequestChangeAccepted ?? undefined,
  }),
  toExternal: (internal) => ({
    id: internal.id,
    stripeSubscriptionId: internal.stripeSubscriptionId,
    stripePaymentIntentId: internal.stripePaymentIntentId,
    customerVAT: internal.customerVAT,
    serviceProviderVAT: internal.serviceProviderVAT,
    netvisorSalesOrderId: internal.netvisorSalesOrderId,
    netvisorSalesInvoiceNumber: internal.netvisorSalesInvoiceNumber,
    minimumDuration: internal.minimumDuration,
    sendToNetvisor: internal.sendToNetvisor,
    isApproved: internal.isApproved,
    isApprovedByBuyer: internal.isApprovedByBuyer,
    paymentParamsId: internal.paymentParamsId,
    paymentInfoId: internal.paymentInfoId,
    offerRequestChanged: internal.offerRequestChanged,
    offerRrequestChangeAccepted: internal.offerRrequestChangeAccepted,

    data: OfferRequestDataDto.adapter.toExternal(internal.data),
    offers: internal.offers
      ? convertFirebaseMapToList(internal.offers)
      : undefined,
    fees: internal.fees ? convertFirebaseMapToList(internal.fees) : undefined,
    paymentTransactions:
      internal.paymentTransactions &&
      convertFirebaseMapToList(internal.paymentTransactions),
    refund: internal.refund
      ? OfferRequestRefundDto.adapter.toExternal(internal.refund)
      : undefined,
    subscription: internal.subscription
      ? OfferRequestSubscriptionDto.adapter.toExternal(internal.subscription)
      : undefined,
    chats: internal.chats
      ? Object.values(internal.chats).map((chat) =>
          OfferRequestChatDto.adapter.toExternal(chat),
        )
      : undefined,
  }),
});
