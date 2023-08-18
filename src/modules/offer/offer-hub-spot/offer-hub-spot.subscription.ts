import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from 'graphql-subscriptions';

import { HubSpotSubscription } from 'src/modules/hub-spot/hub-spot-subscription.interface';
import { PUBSUB_PROVIDER } from 'src/modules/graphql-pubsub/graphql-pubsub.constants';

import {
  OFFER_CREATED_SUBSCRIPTION,
  OFFER_UPDATED_SUBSCRIPTION,
} from '../offer.constants';
import { OfferDto } from '../dto/offer/offer.dto';
import { OfferHubSpotService } from './offer-hub-spot.service';

@Injectable()
export class OfferHubSpotSubscription extends HubSpotSubscription {
  private logger = new Logger(OfferHubSpotSubscription.name);

  constructor(
    private offerHubSpotService: OfferHubSpotService,
    protected configService: ConfigService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {
    super();
  }

  public async subscribe() {
    const unsubscribes = [
      await this.subscribeOnOfferCreation(),
      await this.subscribeOnOfferChanges(),
    ];

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  private async subscribeOnOfferCreation() {
    const subscriptionId = await this.pubSub.subscribe(
      OFFER_CREATED_SUBSCRIPTION,
      (data: Record<typeof OFFER_CREATED_SUBSCRIPTION, OfferDto>) => {
        const offer = data[OFFER_CREATED_SUBSCRIPTION];

        this.childAddedHandler(offer);
      },
    );

    return () => this.pubSub.unsubscribe(subscriptionId);
  }

  private async subscribeOnOfferChanges() {
    const subscriptionId = await this.pubSub.subscribe(
      OFFER_UPDATED_SUBSCRIPTION,
      (data: Record<typeof OFFER_UPDATED_SUBSCRIPTION, OfferDto>) => {
        const offer = data[OFFER_UPDATED_SUBSCRIPTION];

        this.childChangedHandler(offer);
      },
    );

    return () => this.pubSub.unsubscribe(subscriptionId);
  }

  private async childChangedHandler(offer: OfferDto) {
    try {
      if (!offer.hubSpotDealId) {
        return;
      }

      await this.offerHubSpotService.updateDeal(offer);
    } catch (err) {
      this.logger.error(err);
    }
  }

  private async childAddedHandler(offer) {
    try {
      await this.offerHubSpotService.createDeal(offer);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
