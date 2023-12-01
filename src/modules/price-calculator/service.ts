import { Injectable } from '@nestjs/common';
import { CategoryDB } from 'hero24-types';

import { ReceiptDto } from './graphql';
import { CalculateWorkDurationReturnType, FetchRequiredData } from './types';
import {
  convertToDecimalNumber,
  getDiscountValue,
  getDurationInH,
  getValueBeforeVatApplied,
} from './utils';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { FeeService } from '$modules/fee/fee.service';
import { FeePriceCalculatorService } from '$modules/fee/fee-price-calculator/fee-price-calculator.service';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { OfferPriceCalculatorService } from '$modules/offer/offer-price-calculator/offer-price-calculator.service';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestDto } from '$modules/offer-request/dto/offer-request/offer-request.dto';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class PriceCalculatorService {
  private readonly categoryTableRef: FirebaseTableReference<CategoryDB>;

  private readonly config: ConfigType['platform'];

  constructor(
    @Config() config: ConfigType,
    private readonly taskService: OfferService,
    private readonly taskRequestService: OfferRequestService,
    private readonly feeService: FeeService,
    private readonly feePriceCalculatorService: FeePriceCalculatorService,
    private readonly taskPriceCalculationService: OfferPriceCalculatorService,
    firebaseService: FirebaseService,
  ) {
    this.config = config.platform;
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

    const fees = await this.feeService.getFeesByTaskRequestId(taskRequest.id);

    const grossFeeCost =
      await this.feePriceCalculatorService.calculateGrossFeesCost(fees);

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

    const minimumDurationInH = getDurationInH(
      taskRequest.minimumDuration ?? category.minimumDuration,
    );

    const workedDurationInH = this.taskPriceCalculationService
      .getWorkedDuration(task)
      .asHours();

    const purchasedDurationInH = this.taskPriceCalculationService
      .getPurchasedDuration(task)
      .asHours();

    const totalDurationInH = this.taskPriceCalculationService
      .getTotalDuration(task)
      .asHours();

    const actualDurationInH =
      totalDurationInH > minimumDurationInH
        ? totalDurationInH
        : minimumDurationInH;

    return {
      actualDurationInH,
      workedDurationInH,
      minimumDurationInH,
      purchasedDurationInH,
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
