import { Injectable } from '@nestjs/common';
import { CategoryDB } from 'hero24-types';
import { duration as getDurationInH } from 'moment';

import { ReceiptDto } from './graphql';
import {
  convertToDecimalNumber,
  getDiscountValue,
  getFeeTotalWithHero24Cut,
  getValueBeforeVatApplied,
  getWorkedDuration,
} from './utils';
import { getCompletedOfferDuration } from './utils/get-completed-offer-duration';
import { getPurchasedOfferDuration } from './utils/get-purchased-offer-duration';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { FeeService } from '$modules/fee/fee.service';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class PriceCalculatorService {
  private readonly categoryTableRef: FirebaseTableReference<CategoryDB>;

  private readonly config: ConfigType['environment'];

  constructor(
    @Config() config: ConfigType,
    private readonly taskService: OfferService,
    private readonly taskRequestService: OfferRequestService,
    private readonly feeService: FeeService,
    firebaseService: FirebaseService,
  ) {
    this.config = config.environment;
    const database = firebaseService.getDefaultApp().database();

    this.categoryTableRef = database.ref(FirebaseDatabasePath.CATEGORIES);
  }

  async getTaskReceipt(offerId: string): Promise<ReceiptDto> {
    const task = await this.taskService.strictGetOfferById(offerId);

    const taskRequest = await this.taskRequestService.strictGetOfferRequestById(
      task.data.initial.offerRequestId,
    );

    const category = await this.strictGetCategoryById(
      taskRequest.data.initial.category,
    );

    const { pricePerHour } = task.data.initial;
    const workedDuration = await this.calculateWorkDuration(offerId);

    const priceForServiceWithoutDiscount = workedDuration * pricePerHour;

    // ! important its just a stub
    // * now discount is passed as null, because this functionality got stripped out
    // * in future, we should replace null with actual discount
    const discountAmount = getDiscountValue(
      null,
      priceForServiceWithoutDiscount,
    );

    const serviceProvidedPrice =
      priceForServiceWithoutDiscount - discountAmount;

    // * calculate hero gross earning with service provider cut
    const platformFee = this.getPlatformFeeAmount(serviceProvidedPrice);

    const heroGrossEarnings = serviceProvidedPrice - platformFee;

    const serviceProvidedVat =
      taskRequest.serviceProviderVAT ?? category.defaultServiceProviderVAT;

    const heroNetEarnings = getValueBeforeVatApplied(
      heroGrossEarnings,
      serviceProvidedVat,
    );

    const grossFeeCost = await this.calculateGrossFeeCost(taskRequest.id);

    const netFeeCost = getValueBeforeVatApplied(
      grossFeeCost,
      serviceProvidedVat,
    );

    const customerVat = taskRequest.customerVAT ?? category.defaultCustomerVAT;

    return {
      overallAmount: serviceProvidedPrice + grossFeeCost,
      heroNetEarnings: convertToDecimalNumber(heroNetEarnings),
      netFeeCost: convertToDecimalNumber(netFeeCost),
      heroGrossEarnings,
      serviceProvidedVat,
      customerVat,
      grossFeeCost,
      platformFee,
      workedDuration,
      discountAmount,
    };
  }

  async calculateWorkDuration(taskId: string): Promise<number> {
    const task = await this.taskService.strictGetOfferById(taskId);

    const taskRequest = await this.taskRequestService.strictGetOfferRequestById(
      task.data.initial.offerRequestId,
    );

    const category = await this.strictGetCategoryById(
      taskRequest.data.initial.category,
    );

    const minimumWorkDuration = getDurationInH(
      taskRequest.minimumDuration ?? category.minimumDuration,
      'h',
    );

    const workedDuration = getWorkedDuration(
      getCompletedOfferDuration(task),
      minimumWorkDuration,
      getPurchasedOfferDuration(task),
    );

    return workedDuration;
  }

  // TODO use category module when migrated
  async strictGetCategoryById(categoryId: string): Promise<CategoryDB> {
    const category = (
      await this.categoryTableRef.child(categoryId).get()
    ).val();

    if (!category) {
      throw new Error('Category does not exist');
    }

    return category;
  }

  getPlatformFeeAmount(amount: number): number {
    return (amount * this.config.platformFeeInPercents) / 100;
  }

  async calculateGrossFeeCost(taskRequestId: string): Promise<number> {
    const fees = await this.feeService.getFeesByTaskRequestId(taskRequestId);

    const grossFeeCost = fees.reduce(
      (total, fee) => total + getFeeTotalWithHero24Cut(fee),
      0,
    );

    return grossFeeCost;
  }
}
