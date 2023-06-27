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

@ObjectType()
export class OfferRequestDto extends FirebaseGraphQLAdapter<
  OfferRequestDB,
  { id: string }
> {
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

  protected toFirebaseType(): OfferRequestDB {
    return {
      data: OfferRequestDataDto.convertToFirebaseType(this.data),
      offers: this.offers && convertListToFirebaseMap(this.offers),
      fees: this.fees && convertListToFirebaseMap(this.fees),
      paymentTransactions:
        this.paymentTransactions &&
        convertListToFirebaseMap(this.paymentTransactions),
      refund:
        this.refund && OfferRequestRefundDto.convertToFirebaseType(this.refund),
      subscription:
        this.subscription &&
        OfferRequestSubscriptionDto.convertToFirebaseType(this.subscription),
      chats:
        this.chats &&
        Object.fromEntries(
          this.chats.map(({ sellerId, chatId }) => [
            sellerId,
            { sellerProfile: sellerId, chatId },
          ]),
        ),
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

  protected fromFirebaseType(shape: OfferRequestDB & { id: string }): this {
    this.id = shape.id;
    this.stripeSubscriptionId = shape.stripeSubscriptionId;
    this.stripePaymentIntentId = shape.stripePaymentIntentId;
    this.customerVAT = shape.customerVAT;
    this.serviceProviderVAT = shape.serviceProviderVAT;
    this.netvisorSalesOrderId = shape.netvisorSalesOrderId;
    this.netvisorSalesInvoiceNumber = shape.netvisorSalesInvoiceNumber;
    this.minimumDuration = shape.minimumDuration;
    this.sendToNetvisor = shape.sendToNetvisor;
    this.isApproved = shape.isApproved;
    this.isApprovedByBuyer = shape.isApprovedByBuyer;
    this.paymentParamsId = shape.paymentParamsId;
    this.paymentInfoId = shape.paymentInfoId;
    this.offerRequestChanged = shape.offerRequestChanged;
    this.offerRrequestChangeAccepted = shape.offerRrequestChangeAccepted;

    this.data = OfferRequestDataDto.convertFromFirebaseType(shape.data);
    this.offers = shape.offers && convertFirebaseMapToList(shape.offers);
    this.fees = shape.fees && convertFirebaseMapToList(shape.fees);
    this.paymentTransactions =
      shape.paymentTransactions &&
      convertFirebaseMapToList(shape.paymentTransactions);
    this.refund =
      shape.refund &&
      OfferRequestRefundDto.convertFromFirebaseType(shape.refund);
    this.subscription =
      shape.subscription &&
      OfferRequestSubscriptionDto.convertFromFirebaseType(shape.subscription);
    this.chats =
      shape.chats &&
      Object.values(shape.chats).map(({ sellerProfile, chatId }) => ({
        sellerId: sellerProfile,
        chatId,
      }));

    return this;
  }
}
