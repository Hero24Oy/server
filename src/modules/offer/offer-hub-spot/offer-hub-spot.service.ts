import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OfferDto } from '../dto/offer/offer.dto';
import { OfferPriceCalculatorService } from '../offer-price-calculator/offer-price-calculator.service';
import { OfferService } from '../services/offer.service';

import { HUB_SPOT_DEAL_STAGE_BY_OFFER_STATUS } from './offer-hub-spot.constants';

import { FeeService } from '$modules/fee/fee.service';
import { FeePriceCalculatorService } from '$modules/fee/fee-price-calculator/fee-price-calculator.service';
import { HubSpotDealProperty } from '$modules/hub-spot/hub-spot-deal/hub-spot-deal.constants/hub-spot-deal-property.constant';
import { HubSpotDealType } from '$modules/hub-spot/hub-spot-deal/hub-spot-deal.constants/hub-spot-deal-type.constant';
import { HubSpotDealService } from '$modules/hub-spot/hub-spot-deal/hub-spot-deal.service';
import {
  HubSpotDealObject,
  HubSpotDealProperties,
} from '$modules/hub-spot/hub-spot-deal/hub-spot-deal.types';
import { OfferRequestService } from '$modules/offer-request/offer-request.service';
import { RoundedNumber } from '$modules/price-calculator/price-calculator.monad';
import { UserDto } from '$modules/user/dto/user/user.dto';
import { UserService } from '$modules/user/user.service';
import { UserHubSpotService } from '$modules/user/user-hub-spot/user-hub-spot.service';

@Injectable()
export class OfferHubSpotService {
  private readonly dealOwner: string;

  constructor(
    private hubSpotDealService: HubSpotDealService,
    private userHubSpotService: UserHubSpotService,
    private userService: UserService,
    private configService: ConfigService,
    private offerRequestService: OfferRequestService,
    private offerService: OfferService,
    private offerPriceCalculator: OfferPriceCalculatorService,
    private feePriceCalculator: FeePriceCalculatorService,
    private feeService: FeeService,
  ) {
    this.dealOwner = this.configService.getOrThrow('hubSpot.dealOwner');
  }

  async createDeal(offer: OfferDto): Promise<HubSpotDealObject> {
    const properties = await this.prepareDealProperties(offer);

    const deal = await this.hubSpotDealService.createDeal(properties);

    await this.offerService.setHubSpotDealId(offer.id, deal.id);

    return deal;
  }

  public async updateDeal(offer: OfferDto): Promise<HubSpotDealObject> {
    if (!offer.hubSpotDealId) {
      throw new Error('Offer must have hub spot deal id for update');
    }

    const properties = await this.prepareDealProperties(offer);

    return this.hubSpotDealService.updateDeal(offer.hubSpotDealId, properties);
  }

  private async prepareDealProperties(
    offer: OfferDto,
  ): Promise<HubSpotDealProperties> {
    const { data, id } = offer;
    const { initial } = data;

    const { sellerProfileId, buyerProfileId, offerRequestId, agreedStartTime } =
      initial;

    const buyerUser = await this.userService.strictGetUserById(buyerProfileId);

    const sellerUser = await this.userService.strictGetUserById(
      sellerProfileId,
    );

    const amount = this.offerPriceCalculator.getGrossAmount(offer);

    const duration = this.offerPriceCalculator
      .getPurchasedDuration(offer)
      .asHours();

    const pricePerHour = this.offerPriceCalculator.getPricePerHour(offer);

    const closeDate = agreedStartTime;

    const categoryId =
      await this.offerRequestService.strictGetCategoryIdByOfferRequestId(
        offerRequestId,
      );

    const dealStage = HUB_SPOT_DEAL_STAGE_BY_OFFER_STATUS[offer.status];

    const workedDuration = this.offerPriceCalculator
      .getWorkedDuration(offer)
      .asHours();

    const extensionDuration = this.offerPriceCalculator
      .getExtensionDuration(offer)
      .asHours();

    const feeIds = await this.offerRequestService.getFeeIdsByOfferRequestId(
      offerRequestId,
    );

    const fees = await Promise.all(
      feeIds.map((feeId) => this.feeService.strictGetFeeById(feeId)),
    );

    const roundedFeeTotal = fees.reduce(
      (total, fee) =>
        this.feePriceCalculator
          .getFeePriceWithServiceProviderCut(fee)
          .add(total),
      new RoundedNumber(0),
    );

    const feeTotal = roundedFeeTotal.val();

    const properties: HubSpotDealProperties = {
      [HubSpotDealProperty.AMOUNT]: `${amount}`,
      [HubSpotDealProperty.DURATION]: `${duration}`,
      [HubSpotDealProperty.PRICE_PER_HOUR]: `${pricePerHour}`,
      [HubSpotDealProperty.BUYER_PROFILE]: buyerUser.data.email,
      [HubSpotDealProperty.SELLER_PROFILE]: sellerUser.data.email,
      [HubSpotDealProperty.CLOSE_DATE]: closeDate.toISOString(),
      [HubSpotDealProperty.DEAL_OWNER]: this.dealOwner,
      [HubSpotDealProperty.SERVICE_CATEGORY]: categoryId,
      [HubSpotDealProperty.DEAL_TYPE]: HubSpotDealType.NEW_BUSINESS,
      [HubSpotDealProperty.DEAL_STAGE]: dealStage,
      [HubSpotDealProperty.ACTUAL_DURATION]: `${workedDuration}`,
      [HubSpotDealProperty.EXTRA_TIME]: `${extensionDuration}`,
      [HubSpotDealProperty.MATERIAL_FEE]: `${feeTotal}`,
      [HubSpotDealProperty.DEAL_NAME]: `${categoryId} ${buyerUser.data.name}`,
      [HubSpotDealProperty.DEAL_ID]: id,
    };

    return properties;
  }

  private async getHubSpotContactId(user: UserDto): Promise<string> {
    const { hubSpotContactId } = user;

    if (!hubSpotContactId) {
      const contact = await this.userHubSpotService.strictUpsertContact(user);

      return contact.id;
    }

    return hubSpotContactId;
  }
}
