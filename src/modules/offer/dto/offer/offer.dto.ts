import { Field, Float, ObjectType } from '@nestjs/graphql';
import { OfferDataDto } from './offer-data.dto';
import { OfferEarningsDto } from './offer-earnings.dto';
import { OFFER_STATUS, OfferDB } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';

@ObjectType()
export class OfferDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  status: OFFER_STATUS;

  @Field(() => OfferDataDto)
  data: OfferDataDto;

  @Field(() => Boolean)
  seenByBuyer: boolean;

  @Field(() => Boolean)
  isApproved: boolean;

  @Field(() => String, { nullable: true })
  chatId?: MaybeType<string>;

  @Field(() => Float, { nullable: true })
  timeToExtend?: MaybeType<number>;

  @Field(() => String, { nullable: true })
  reasonToExtend?: MaybeType<string>;

  @Field(() => [String], { nullable: true })
  paymentTransactions?: MaybeType<string[]>;

  @Field(() => OfferEarningsDto, { nullable: true })
  earnings?: MaybeType<OfferEarningsDto>;

  @Field(() => Boolean)
  preDayReminderSent?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  preHourReminderSent?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  pre30MinReminderSent?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  pre15MinReminderSent?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  timeEndedReminderSent?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  timeEndedAfter15MinReminderSent?: MaybeType<boolean>;

  @Field(() => String, { nullable: true })
  netvisorOrderId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  netvisorSalesInvoiceId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  netvisorPurchaseInvoiceId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  netvisorPurchaseInvoiceBatchId?: MaybeType<string>;

  @Field(() => Float, { nullable: true })
  sendToNetvisorSalesInvoice?: MaybeType<number>;

  @Field(() => Float, { nullable: true })
  sendToNetvisorPurchaseInvoice?: MaybeType<number>;

  @Field(() => String, { nullable: true })
  paymentInfoId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  stripePaymentIntentId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  hubSpotDealId?: MaybeType<string>;

  static adapter: FirebaseAdapter<
    Omit<OfferDB, 'hubspotDealId'> & { id: string; hubSpotDealId?: string }, // TODO: update OfferDB type
    OfferDto
  >;
}

OfferDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    status: internal.status,
    data: OfferDataDto.adapter.toExternal(internal.data),
    seenByBuyer: internal.buyerData?.seenByBuyer || false,
    isApproved: internal.isApproved || false,
    chatId: internal.chat,
    timeToExtend: internal.timeToExtend,
    reasonToExtend: internal.reasonToExtend,
    paymentTransactions: internal.paymentTransactions
      ? convertFirebaseMapToList(internal.paymentTransactions)
      : null,
    earnings:
      internal.earnings &&
      OfferEarningsDto.adapter.toExternal(internal.earnings),
    preDayReminderSent: internal.preDayReminderSent,
    preHourReminderSent: internal.preHourReminderSent,
    pre30MinReminderSent: internal.pre30MinReminderSent,
    pre15MinReminderSent: internal.pre15MinReminderSent,
    timeEndedReminderSent: internal.timeEndedReminderSent,
    timeEndedAfter15MinReminderSent: internal.timeEndedAfter15MinReminderSent,
    netvisorOrderId: internal.netvisorOrderId,
    netvisorSalesInvoiceId: internal.netvisorSalesInvoiceId,
    netvisorPurchaseInvoiceId: internal.netvisorPurchaseInvoiceId,
    netvisorPurchaseInvoiceBatchId: internal.netvisorPurchaseInvoiceBatchId,
    sendToNetvisorSalesInvoice: internal.sendToNetvisorSalesInvoice,
    sendToNetvisorPurchaseInvoice: internal.sendToNetvisorPurchaseInvoice,
    paymentInfoId: internal.paymentInfoId,
    stripePaymentIntentId: internal.stripePaymentIntentId,
    hubSpotDealId: internal.hubSpotDealId,
  }),
  toInternal: (external) => ({
    id: external.id,
    status: external.status,
    data: OfferDataDto.adapter.toInternal(external.data),
    buyerData: external.seenByBuyer ? { seenByBuyer: true } : undefined,
    seenByBuyer: external.seenByBuyer,
    isApproved: external.isApproved,
    chat: external.chatId ?? undefined,
    timeToExtend: external.timeToExtend ?? undefined,
    reasonToExtend: external.reasonToExtend ?? undefined,
    paymentTransactions: external.paymentTransactions
      ? convertListToFirebaseMap(external.paymentTransactions)
      : undefined,
    earnings: external.earnings
      ? OfferEarningsDto.adapter.toInternal(external.earnings)
      : undefined,
    preDayReminderSent: external.preDayReminderSent ?? undefined,
    preHourReminderSent: external.preHourReminderSent ?? undefined,
    pre30MinReminderSent: external.pre30MinReminderSent ?? undefined,
    pre15MinReminderSent: external.pre15MinReminderSent ?? undefined,
    timeEndedReminderSent: external.timeEndedReminderSent ?? undefined,
    timeEndedAfter15MinReminderSent:
      external.timeEndedAfter15MinReminderSent ?? undefined,
    netvisorOrderId: external.netvisorOrderId ?? undefined,
    netvisorSalesInvoiceId: external.netvisorSalesInvoiceId ?? undefined,
    netvisorPurchaseInvoiceId: external.netvisorPurchaseInvoiceId ?? undefined,
    netvisorPurchaseInvoiceBatchId:
      external.netvisorPurchaseInvoiceBatchId ?? undefined,
    sendToNetvisorSalesInvoice:
      external.sendToNetvisorSalesInvoice ?? undefined,
    sendToNetvisorPurchaseInvoice:
      external.sendToNetvisorPurchaseInvoice ?? undefined,
    paymentInfoId: external.paymentInfoId ?? undefined,
    stripePaymentIntentId: external.stripePaymentIntentId ?? undefined,
    hubSpotDealId: external.hubSpotDealId ?? undefined,
    paymentParamsId: undefined, // TODO: remove it from OfferDB types
    sendToNetvisor: undefined, // TODO: remove it from OfferDB types
  }),
});
