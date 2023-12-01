import { Injectable } from '@nestjs/common';
import { CategoryDB } from 'hero24-types';

import { ReceiptDto } from './graphql';
import { CalculateWorkDurationReturnType, FetchRequiredData } from './types';
import {
  convertToDecimalNumber,
  getCompletedOfferDuration,
  getDiscountValue,
  getDurationInH,
  getPurchasedOfferDuration,
  getValueBeforeVatApplied,
  getWorkedDurationInH,
  RoundedNumber,
  roundedOfferDurationInH,
} from './utils';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { FeeService } from '$modules/fee/fee.service';
import { FeePriceCalculatorService } from '$modules/fee/fee-price-calculator/fee-price-calculator.service';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestDto } from '$modules/offer-request/dto/offer-request/offer-request.dto';
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
    private readonly feePriceCalculatorService: FeePriceCalculatorService,
    firebaseService: FirebaseService,
  ) {
    this.config = config.environment;
    const database = firebaseService.getDefaultApp().database();

    this.categoryTableRef = database.ref(FirebaseDatabasePath.CATEGORIES);
  }

  async getTaskReceipt(taskId: string): Promise<ReceiptDto> {
    const { category, task, taskRequest } = await this.fetchRequiredData(
      taskId,
    );

    const {
      actualDurationInH,
      minimumDurationInH,
      purchasedDurationInH,
      workedDurationInH,
    } = await this.calculateWorkDuration(taskId);

    const { pricePerHour } = task.data.initial;
    const priceForServiceWithoutDiscount = actualDurationInH * pricePerHour;

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
    const platformFee = this.getPlatformFeeAmount(
      serviceProvidedPrice,
      taskRequest,
    );

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
      discountAmount,
      actualDurationInH,
      workedDurationInH,
      minimumDurationInH,
      purchasedDurationInH,
      pricePerHourWithVat: pricePerHour,
      pricePerHourWithoutVat: convertToDecimalNumber(
        getValueBeforeVatApplied(pricePerHour, serviceProvidedVat),
      ),
    };
  }

  async calculateWorkDuration(
    taskId: string,
  ): Promise<CalculateWorkDurationReturnType> {
    const task = await this.taskService.strictGetOfferById(taskId);

    const taskRequest = await this.taskRequestService.strictGetOfferRequestById(
      task.data.initial.offerRequestId,
    );

    const category = await this.strictGetCategoryById(
      taskRequest.data.initial.category,
    );

    const minimumDuration = getDurationInH(
      taskRequest.minimumDuration ?? category.minimumDuration,
    );

    const workedDuration = getCompletedOfferDuration(task);

    const workedDurationInH = roundedOfferDurationInH(
      workedDuration.asMilliseconds(),
    );

    const purchasedDuration = getPurchasedOfferDuration(task);

    const actualDurationInH = getWorkedDurationInH({
      minimumDuration,
      purchasedDuration,
      workedDuration,
    });

    return {
      actualDurationInH,
      workedDurationInH,
      minimumDurationInH: minimumDuration.asHours(),
      purchasedDurationInH: purchasedDuration.asHours(),
    };
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

  getPlatformFeeAmount(amount: number, taskRequest: OfferRequestDto): number {
    const hero24Cut =
      taskRequest.hero24Cut ?? this.config.platformFeeInPercents;

    return (amount * hero24Cut) / 100;
  }

  async calculateGrossFeeCost(taskRequestId: string): Promise<number> {
    const fees = await this.feeService.getFeesByTaskRequestId(taskRequestId);

    const grossFeeCost = fees.reduce(
      (total, fee) =>
        total.add(
          this.feePriceCalculatorService.getFeePriceWithServiceProviderCut(fee),
        ),
      new RoundedNumber(0),
    );

    return grossFeeCost.val();
  }

  private async fetchRequiredData(taskId: string): Promise<FetchRequiredData> {
    const task = await this.taskService.strictGetOfferById(taskId);

    const taskRequest = await this.taskRequestService.strictGetOfferRequestById(
      task.data.initial.offerRequestId,
    );

    const category = await this.strictGetCategoryById(
      taskRequest.data.initial.category,
    );

    return {
      task,
      taskRequest,
      category,
    };
  }
}
