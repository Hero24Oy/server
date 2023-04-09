import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';
import { OfferRequestChatDto } from './offer-request-chat.dto';
import { OfferRequestDataDto } from './offer-request-data.dto';
import { OfferRequestRefundDto } from './offer-request-refund.dto';
import { OfferRequestSubscriptionDto } from './offer-request-subscription.dto';

@ObjectType()
export class OfferRequestDto {
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

  @Field(() => Int, { nullable: true })
  customerVAT?: number;

  @Field(() => Int, { nullable: true })
  serviceProviderVAT?: number;

  @Field(() => String, { nullable: true })
  netvisorSalesOrderId?: string;

  @Field(() => Int, { nullable: true })
  netvisorSalesInvoiceNumber?: number;

  @Field(() => Int, { nullable: true })
  minimumDuration?: number;

  @Field(() => Int, { nullable: true })
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

  static convertFromFirebaseType(
    data: OfferRequestDB,
    id: string,
  ): OfferRequestDto {
    return {
      ...data,
      id,
      data: OfferRequestDataDto.convertFromFirebaseType(data.data),
      offers: data.offers && convertFirebaseMapToList(data.offers),
      fees: data.fees && convertFirebaseMapToList(data.fees),
      paymentTransactions:
        data.paymentTransactions &&
        convertFirebaseMapToList(data.paymentTransactions),
      refund:
        data.refund &&
        OfferRequestRefundDto.convertFromFirebaseType(data.refund),
      subscription:
        data.subscription &&
        OfferRequestSubscriptionDto.convertFromFirebaseType(data.subscription),
      chats:
        data.chats &&
        Object.values(data.chats).map(({ sellerProfile, chatId }) => ({
          sellerId: sellerProfile,
          chatId,
        })),
    };
  }

  static convertToFirebaseType(data: OfferRequestDto): OfferRequestDB {
    return {
      ...data,
      data: OfferRequestDataDto.convertToFirebaseType(data.data),
      offers: data.offers && convertListToFirebaseMap(data.offers),
      fees: data.fees && convertListToFirebaseMap(data.fees),
      paymentTransactions:
        data.paymentTransactions &&
        convertListToFirebaseMap(data.paymentTransactions),
      refund:
        data.refund && OfferRequestRefundDto.convertToFirebaseType(data.refund),
      subscription:
        data.subscription &&
        OfferRequestSubscriptionDto.convertToFirebaseType(data.subscription),
      chats:
        data.chats &&
        Object.fromEntries(
          data.chats.map(({ sellerId, chatId }) => [
            sellerId,
            { sellerProfile: sellerId, chatId },
          ]),
        ),
    };
  }
}
