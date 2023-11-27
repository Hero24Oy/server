import { Injectable } from '@nestjs/common';
import { CategoryDB } from 'hero24-types';
import { duration as getDurationInH } from 'moment';

import { ReceiptDto } from './dto';
import {
  convertToDecimalNumber,
  Discount,
  getDiscountValue,
  // getDiscountValue,
  getFeeTotalWithHero24Cut,
  getValueBeforeVatApplied,
  getWorkedDuration,
} from './price-calculator.utils';
import { getCompletedOfferDuration } from './price-calculator.utils/get-completed-offer-duration';
import { getPurchasedOfferDuration } from './price-calculator.utils/get-purchased-offer-duration';
import { SERVICE_PROVIDER_CUT } from './price-calculator.utils/get-value-with-service-cut-applied';

import { FeeService } from '$modules/fee/fee.service';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

@Injectable()
export class PriceCalculatorService {
  private readonly categoryTableRef: FirebaseTableReference<CategoryDB>;

  constructor(
    private readonly taskService: OfferService,
    private readonly taskRequestService: OfferRequestService,
    private readonly feeService: FeeService,
    firebaseService: FirebaseService,
  ) {
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
    // * overallServiceProvidedPrice is the amount of money which is paid by customer
    const serviceProvidedPrice = this.getValueWithDiscount(
      null,
      priceForServiceWithoutDiscount,
    );

    // * calculate hero gross earning with service provider cut
    const platformFee =
      // eslint-disable-next-line no-magic-numbers -- 100 is percents
      (serviceProvidedPrice * SERVICE_PROVIDER_CUT) / 100;

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

    return {
      overallAmount: serviceProvidedPrice + grossFeeCost,
      heroNetEarnings: convertToDecimalNumber(heroNetEarnings),
      netFeeCost: convertToDecimalNumber(netFeeCost),
      heroGrossEarnings,
      serviceProvidedVat,
      grossFeeCost,
      platformFee,
      workedDuration,
    };
  }

  getValueWithDiscount(
    discount: Discount | null,
    initialValue: number,
  ): number {
    return initialValue - getDiscountValue(discount, initialValue);
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

  async calculateGrossFeeCost(taskRequestId: string): Promise<number> {
    const fees = await this.feeService.getFeesByTaskRequestId(taskRequestId);

    const grossFeeCost = fees.reduce(
      (total, fee) => total + getFeeTotalWithHero24Cut(fee),
      0,
    );

    return grossFeeCost;
  }
}
