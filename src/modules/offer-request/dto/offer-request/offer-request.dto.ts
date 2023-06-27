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
import { TypeSafeRequired } from 'src/modules/common/common.types';

type OfferRequestShape = {
  id: string;
  data: OfferRequestDataDto;
  chats?: OfferRequestChatDto[];
  subscription?: OfferRequestSubscriptionDto;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  customerVAT?: number;
  serviceProviderVAT?: number;
  netvisorSalesOrderId?: string;
  netvisorSalesInvoiceNumber?: number;
  minimumDuration?: number;
  sendToNetvisor?: number;
  isApproved?: boolean;
  isApprovedByBuyer?: boolean;
  offers?: string[];
  fees?: string[];
  paymentParamsId?: string; // legacy
  paymentInfoId?: string;
  paymentTransactions?: string[];
  offerRequestChanged?: boolean;
  offerRrequestChangeAccepted?: boolean;
  refund?: OfferRequestRefundDto;
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
  chats?: OfferRequestChatDto[];

  @Field(() => OfferRequestSubscriptionDto, { nullable: true })
  subscription?: OfferRequestSubscriptionDto;

  @Field(() => String, { nullable: true })
  stripeSubscriptionId?: string;

  @Field(() => String, { nullable: true })
  stripePaymentIntentId?: string;

  @Field(() => Float, { nullable: true })
  customerVAT?: number;

  @Field(() => Float, { nullable: true })
  serviceProviderVAT?: number;

  @Field(() => String, { nullable: true })
  netvisorSalesOrderId?: string;

  @Field(() => Float, { nullable: true })
  netvisorSalesInvoiceNumber?: number;

  @Field(() => Float, { nullable: true })
  minimumDuration?: number;

  @Field(() => Float, { nullable: true })
  sendToNetvisor?: number;

  @Field(() => Boolean, { nullable: true })
  isApproved?: boolean;

  @Field(() => Boolean, { nullable: true })
  isApprovedByBuyer?: boolean;

  @Field(() => [String], { nullable: true })
  offers?: string[];

  @Field(() => [String], { nullable: true })
  fees?: string[];

  @Field(() => String, { nullable: true })
  paymentParamsId?: string; // legacy

  @Field(() => String, { nullable: true })
  paymentInfoId?: string;

  @Field(() => [String], { nullable: true })
  paymentTransactions?: string[];

  @Field(() => Boolean, { nullable: true })
  offerRequestChanged?: boolean;

  @Field(() => Boolean, { nullable: true })
  offerRrequestChangeAccepted?: boolean;

  @Field(() => OfferRequestRefundDto, { nullable: true })
  refund?: OfferRequestRefundDto;

  protected toFirebaseType(): TypeSafeRequired<OfferRequestDB> {
    return {
      data: this.data.toFirebase(),
      offers: this.offers ? convertListToFirebaseMap(this.offers) : undefined,
      fees: this.fees ? convertListToFirebaseMap(this.fees) : undefined,
      paymentTransactions: this.paymentTransactions
        ? convertListToFirebaseMap(this.paymentTransactions)
        : undefined,
      refund: this.refund
        ? OfferRequestRefundDto.convertToFirebaseType(this.refund)
        : undefined,
      subscription:
        this.subscription &&
        OfferRequestSubscriptionDto.convertToFirebaseType(this.subscription),
      chats: this.chats
        ? Object.fromEntries(
            this.chats.map(({ sellerId, chatId }) => [
              sellerId,
              { sellerProfile: sellerId, chatId },
            ]),
          )
        : undefined,
      stripeSubscriptionId: this.stripeSubscriptionId,
      stripePaymentIntentId: this.stripePaymentIntentId,
      customerVAT: this.customerVAT,
      serviceProviderVAT: this.serviceProviderVAT,
      netvisorSalesOrderId: this.netvisorSalesOrderId,
      netvisorSalesInvoiceNumber: this.netvisorSalesInvoiceNumber,
      minimumDuration: this.minimumDuration,
      sendToNetvisor: this.sendToNetvisor,
      isApproved: this.isApproved,
      isApprovedByBuyer: this.isApprovedByBuyer,
      paymentParamsId: this.paymentParamsId,
      paymentInfoId: this.paymentInfoId,
      offerRequestChanged: this.offerRequestChanged,
      offerRrequestChangeAccepted: this.offerRrequestChangeAccepted,
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
        ? OfferRequestRefundDto.convertFromFirebaseType(shape.refund)
        : undefined,
      subscription: shape.subscription
        ? OfferRequestSubscriptionDto.convertFromFirebaseType(
            shape.subscription,
          )
        : undefined,
      chats: shape.chats
        ? Object.values(shape.chats).map(({ sellerProfile, chatId }) => ({
            sellerId: sellerProfile,
            chatId,
          }))
        : undefined,
    };
  }
}
