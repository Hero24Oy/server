import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';

import { OfferRequestChatDto } from './offer-request-chat.dto';
import { OfferRequestDataDto } from './offer-request-data.dto';
import { OfferRequestRefundDto } from './offer-request-refund.dto';
import { OfferRequestSubscriptionDto } from './offer-request-subscription.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';

type OfferRequestShape = {
  id: string;
  data: OfferRequestDataDto;
  chats?: MaybeType<OfferRequestChatDto[]>;
  subscription?: MaybeType<OfferRequestSubscriptionDto>;
  stripeSubscriptionId?: MaybeType<string>;
  stripePaymentIntentId?: MaybeType<string>;
  customerVAT?: MaybeType<number>;
  serviceProviderVAT?: MaybeType<number>;
  netvisorSalesOrderId?: MaybeType<string>;
  netvisorSalesInvoiceNumber?: MaybeType<number>;
  minimumDuration?: MaybeType<number>;
  sendToNetvisor?: MaybeType<number>;
  isApproved?: MaybeType<boolean>;
  isApprovedByBuyer?: MaybeType<boolean>;
  offers?: MaybeType<string[]>;
  fees?: MaybeType<string[]>;
  paymentParamsId?: MaybeType<string>; // legacy
  paymentInfoId?: MaybeType<string>;
  paymentTransactions?: MaybeType<string[]>;
  offerRequestChanged?: MaybeType<boolean>;
  offerRrequestChangeAccepted?: MaybeType<boolean>;
  refund?: MaybeType<OfferRequestRefundDto>;
};

@ObjectType()
export class OfferRequestDto
  extends FirebaseGraphQLAdapter<
    OfferRequestShape,
    OfferRequestDB,
    { id: string }
  >
  implements OfferRequestShape
{
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

  protected toFirebaseType(): TypeSafeRequired<OfferRequestDB> {
    return {
      data: this.data.toFirebase(),
      offers: this.offers ? convertListToFirebaseMap(this.offers) : undefined,
      fees: this.fees ? convertListToFirebaseMap(this.fees) : undefined,
      paymentTransactions: this.paymentTransactions
        ? convertListToFirebaseMap(this.paymentTransactions)
        : undefined,
      refund: this.refund ? this.refund.toFirebase() : undefined,
      subscription: this.subscription
        ? this.subscription.toFirebase()
        : undefined,
      chats: this.chats
        ? Object.fromEntries(
            this.chats.map((chat) => [chat.sellerId, chat.toFirebase()]),
          )
        : undefined,
      stripeSubscriptionId: this.stripeSubscriptionId ?? undefined,
      stripePaymentIntentId: this.stripePaymentIntentId ?? undefined,
      customerVAT: this.customerVAT ?? undefined,
      serviceProviderVAT: this.serviceProviderVAT ?? undefined,
      netvisorSalesOrderId: this.netvisorSalesOrderId ?? undefined,
      netvisorSalesInvoiceNumber: this.netvisorSalesInvoiceNumber ?? undefined,
      minimumDuration: this.minimumDuration ?? undefined,
      sendToNetvisor: this.sendToNetvisor ?? undefined,
      isApproved: this.isApproved ?? undefined,
      isApprovedByBuyer: this.isApprovedByBuyer ?? undefined,
      paymentParamsId: this.paymentParamsId ?? undefined,
      paymentInfoId: this.paymentInfoId ?? undefined,
      offerRequestChanged: this.offerRequestChanged ?? undefined,
      offerRrequestChangeAccepted:
        this.offerRrequestChangeAccepted ?? undefined,
    };
  }

  protected fromFirebaseType(
    shape: OfferRequestDB & { id: string },
  ): TypeSafeRequired<OfferRequestShape> {
    return {
      id: shape.id,
      stripeSubscriptionId: shape.stripeSubscriptionId,
      stripePaymentIntentId: shape.stripePaymentIntentId,
      customerVAT: shape.customerVAT,
      serviceProviderVAT: shape.serviceProviderVAT,
      netvisorSalesOrderId: shape.netvisorSalesOrderId,
      netvisorSalesInvoiceNumber: shape.netvisorSalesInvoiceNumber,
      minimumDuration: shape.minimumDuration,
      sendToNetvisor: shape.sendToNetvisor,
      isApproved: shape.isApproved,
      isApprovedByBuyer: shape.isApprovedByBuyer,
      paymentParamsId: shape.paymentParamsId,
      paymentInfoId: shape.paymentInfoId,
      offerRequestChanged: shape.offerRequestChanged,
      offerRrequestChangeAccepted: shape.offerRrequestChangeAccepted,

      data: new OfferRequestDataDto().fromFirebase(shape.data),
      offers: shape.offers ? convertFirebaseMapToList(shape.offers) : undefined,
      fees: shape.fees ? convertFirebaseMapToList(shape.fees) : undefined,
      paymentTransactions:
        shape.paymentTransactions &&
        convertFirebaseMapToList(shape.paymentTransactions),
      refund: shape.refund
        ? new OfferRequestRefundDto().fromFirebase(shape.refund)
        : undefined,
      subscription: shape.subscription
        ? new OfferRequestSubscriptionDto().fromFirebase(shape.subscription)
        : undefined,
      chats: shape.chats
        ? Object.values(shape.chats).map((chat) =>
            new OfferRequestChatDto().fromFirebase(chat),
          )
        : undefined,
    };
  }
}
