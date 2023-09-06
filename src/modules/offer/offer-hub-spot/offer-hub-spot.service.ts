import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  HubSpotDealObject,
  HubSpotDealProperties,
} from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.types';
import { HubSpotDealService } from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.service';
import { UserService } from 'src/modules/user/user.service';
import { UserHubSpotService } from 'src/modules/user/user-hub-spot/user-hub-spot.service';
import { UserDto } from 'src/modules/user/dto/user/user.dto';
import { HubSpotDealProperty } from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.constants/hub-spot-deal-property.constant';
import { HubSpotDealType } from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.constants/hub-spot-deal-type.constant';
import { OfferRequestService } from 'src/modules/offer-request/offer-request.service';
import { FeePriceCalculatorService } from 'src/modules/fee/fee-price-calculator/fee-price-calculator.service';
import { FeeService } from 'src/modules/fee/fee.service';
import { RoundedNumber } from 'src/modules/price-calculator/price-calculator.monad';

import { OfferPriceCalculatorService } from '../offer-price-calculator/offer-price-calculator.service';
import { OfferDto } from '../dto/offer/offer.dto';
import { HUB_SPOT_DEAL_STAGE_BY_OFFER_STATUS } from './offer-hub-spot.constants';
import { OfferService } from '../services/offer.service';

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
    const { sellerProfileId, buyerProfileId } = offer.data.initial;

    const buyerUser = await this.userService.strictGetUserById(buyerProfileId);
    const sellerUser = await this.userService.strictGetUserById(
      sellerProfileId,
    );

    const buyerHubSpotContactId = await this.getHubSpotContactId(buyerUser);
    const sellerHubSpotContactId = await this.getHubSpotContactId(sellerUser);

    const properties = await this.prepareDealProperties(offer);

    const deal = await this.hubSpotDealService.createDeal(properties, [
      buyerHubSpotContactId,
      sellerHubSpotContactId,
    ]);

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
    const { sellerProfileId, buyerProfileId, offerRequestId, agreedStartTime } =
      offer.data.initial;

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
      [HubSpotDealProperty.BUYER_PROFILE]: buyerUser.data.email ?? '',
      [HubSpotDealProperty.SELLER_PROFILE]: sellerUser.data.email ?? '',
      [HubSpotDealProperty.CLOSE_DATE]: closeDate.toISOString(),
      [HubSpotDealProperty.DEAL_OWNER]: this.dealOwner,
      [HubSpotDealProperty.SERVICE_CATEGORY]: categoryId,
      [HubSpotDealProperty.DEAL_TYPE]: HubSpotDealType.NEW_BUSINESS,
      [HubSpotDealProperty.DEAL_STAGE]: dealStage,
      [HubSpotDealProperty.ACTUAL_DURATION]: `${workedDuration}`,
      [HubSpotDealProperty.EXTRA_TIME]: `${extensionDuration}`,
      [HubSpotDealProperty.MATERIAL_FEE]: `${feeTotal}`,
      [HubSpotDealProperty.DEAL_NAME]: `${categoryId} ${buyerUser.data.name}`,
    };

    return properties;
  }

  private async getHubSpotContactId(user: UserDto) {
    const hubSpotContactId = user.hubSpotContactId;

    if (!hubSpotContactId) {
      const contact = await this.userHubSpotService.strictUpsertContact(user);

      return contact.id;
    }

    return hubSpotContactId;
  }
}
