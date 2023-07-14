import { Injectable } from '@nestjs/common';
import { OfferDto } from '../dto/offer/offer.dto';
import {
  HubSpotDealObject,
  HubSpotDealProperties,
} from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.types';
import { HubSpotDealService } from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.service';
import { UserService } from 'src/modules/user/user.service';
import { UserHubSpotService } from 'src/modules/user/user-hub-spot/user-hub-spot.service';
import { UserDto } from 'src/modules/user/dto/user/user.dto';
import { ConfigService } from '@nestjs/config';
import { HubSpotDealProperty } from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.constants/hub-spot-deal-property.constant';
import { HUB_SPOT_DEAL_STAGE_BY_OFFER_STATUS } from './offer-hub-spot.constants';
import { HubSpotDealType } from 'src/modules/hub-spot/hub-spot-deal/hub-spot-deal.constants/hub-spot-deal-type.constant';
import { OfferRequestService } from 'src/modules/offer-request/offer-request.service';
import { OfferService } from '../offer.service';

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
    const {
      purchase: { pricePerHour, duration },
      sellerProfileId,
      buyerProfileId,
    } = offer.data.initial;

    const buyerUser = await this.userService.strictGetUserById(buyerProfileId);
    const sellerUser = await this.userService.strictGetUserById(
      sellerProfileId,
    );

    const closeDate = new Date(
      offer.data.initial.agreedStartTime,
    ).toISOString();

    const dealStage = HUB_SPOT_DEAL_STAGE_BY_OFFER_STATUS[offer.status];
    const category =
      await this.offerRequestService.strictGetCategoryIdByOfferRequestId(
        offer.data.initial.offerRequestId,
      );

    const properties: HubSpotDealProperties = {
      [HubSpotDealProperty.AMOUNT]: (duration * pricePerHour).toFixed(2),
      [HubSpotDealProperty.DURATION]: duration.toString(),
      [HubSpotDealProperty.PRICE_PER_HOUR]: pricePerHour.toFixed(2),
      [HubSpotDealProperty.BUYER_PROFILE]: buyerUser.data.email,
      [HubSpotDealProperty.SELLER_PROFILE]: sellerUser.data.email,
      [HubSpotDealProperty.CLOSE_DATE]: closeDate,
      [HubSpotDealProperty.DEAL_OWNER]: this.dealOwner,
      [HubSpotDealProperty.SERVICE_CATEGORY]: category,
      [HubSpotDealProperty.DEAL_TYPE]: HubSpotDealType.NEW_BUSINESS,
      [HubSpotDealProperty.DEAL_STAGE]: dealStage,
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
