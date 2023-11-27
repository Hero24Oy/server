import { Injectable } from '@nestjs/common';
import { CategoryDB } from 'hero24-types';
import { duration as getDurationInH } from 'moment';

import { ReceiptDto } from './dto';
import {
  // getDiscountValue,
  getFeeTotalWithHero24Cut,
  getFeeTotalWithoutHero24Cut,
  getValueBeforeVatApplied,
  getWorkedDuration,
} from './price-calculator.utils';
import { getCompletedOfferDuration } from './price-calculator.utils/get-completed-offer-duration';
import { getPercents } from './price-calculator.utils/get-percents';
import { getPurchasedOfferDuration } from './price-calculator.utils/get-purchased-offer-duration';
import { SERVICE_PROVIDER_CUT } from './price-calculator.utils/get-value-with-service-cut-applied';

import { Scope } from '$modules/auth/auth.constants';
import { FeeService } from '$modules/fee/fee.service';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';
import { OfferService } from '$modules/offer/services/offer.service';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';

// TODO add tests
@Injectable()
export class PriceCalculatorService {
  private readonly categoryTableRef: FirebaseTableReference<CategoryDB>;

  constructor(
    private readonly offerService: OfferService,
    private readonly offerRequestService: OfferRequestService,
    private readonly feeService: FeeService,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.categoryTableRef = database.ref(FirebaseDatabasePath.CATEGORIES);
  }

  async getOfferReceipt(offerId: string): Promise<ReceiptDto> {
    const offer = await this.offerService.strictGetOfferById(offerId);

    // TODO extract time calculating to service
    const offerRequest =
      await this.offerRequestService.strictGetOfferRequestById(
        offer.data.initial.offerRequestId,
      );

    const category = (
      await this.categoryTableRef
        .child(offerRequest.data.initial.category)
        .get()
    ).val();

    // TODO extract to category service
    if (!category) {
      throw new Error('Category does not exist');
    }

    const { pricePerHour } = offer.data.initial;

    // * PRICE COMPUTING
    const workedDuration = await this.calculateWorkDuration(offerId);

    // TODO better naming
    // * initially calculate the main part of the price based on worked hours and rate
    const priceForServiceWithoutDiscount = workedDuration * pricePerHour;

    // * is not implemented, just stub
    // ! important
    // * now discount is passed as null, because this functionality got stripped out
    // * in future, we should replace null with actual discount
    // const discountForService = getDiscountValue(
    //   null,
    //   priceForServiceWithoutDiscount,
    // );
    // * Discounts are disabled for the moment
    const discountForService = 0;

    const overallServiceProvidedPrice =
      priceForServiceWithoutDiscount - discountForService;

    // * calculate hero gross earning with service provider cut
    const platformFee = getPercents(
      overallServiceProvidedPrice,
      SERVICE_PROVIDER_CUT,
    );

    const heroGrossEarnings = overallServiceProvidedPrice - platformFee;

    const serviceProvidedVat =
      offerRequest.serviceProviderVAT ?? category.defaultServiceProviderVAT;

    const heroNetEarnings = getValueBeforeVatApplied(
      heroGrossEarnings,
      serviceProvidedVat,
    );

    // * Calculate fees
    // ! TODO remove this
    const fees = await this.feeService.getFeeList(
      {
        filter: {
          offerRequestId: offerRequest.id,
        },
      },
      {
        id: 'test',
        scope: Scope.USER,
      },
    );

    const grossFeeCost = fees.edges.reduce(
      (total, { node }) => total + getFeeTotalWithHero24Cut(node),
      0,
    );

    const netFeeCost = fees.edges.reduce(
      (total, { node }) => total + getFeeTotalWithoutHero24Cut(node),
      0,
    );

    return {
      overallServiceProvidedPrice,
      serviceProvidedVat,
      feeTotal: netFeeCost,
      platformFee: SERVICE_PROVIDER_CUT, // TODO rename service provider cut to platformFee
      heroGrossEarnings: heroGrossEarnings + grossFeeCost,
      heroNetEarnings: heroNetEarnings + netFeeCost,
      heroVatAmount: heroGrossEarnings - heroNetEarnings,
      workedDuration,
    };
  }

  async calculateWorkDuration(offerId: string): Promise<number> {
    const offer = await this.offerService.strictGetOfferById(offerId);

    const offerRequest =
      await this.offerRequestService.strictGetOfferRequestById(
        offer.data.initial.offerRequestId,
      );

    const category = (
      await this.categoryTableRef
        .child(offerRequest.data.initial.category)
        .get()
    ).val();

    // TODO extract to category service
    if (!category) {
      throw new Error('Category does not exist');
    }

    // TODO extract to a function
    const minimumWorkDuration = getDurationInH(
      offerRequest.minimumDuration ?? category.minimumDuration,
      'h',
    );

    const workedDuration = getWorkedDuration(
      getCompletedOfferDuration(offer),
      minimumWorkDuration,
      getPurchasedOfferDuration(offer),
    );

    return workedDuration;
  }
}
