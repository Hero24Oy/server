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
import { subscribeToEvent } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

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
    return subscribeToEvent({
      pubSub: this.pubSub,
      eventHandler: this.offerCreatedHandler,
      triggerName: OFFER_CREATED_SUBSCRIPTION,
    });
  }

  private async subscribeOnOfferChanges() {
    return subscribeToEvent({
      pubSub: this.pubSub,
      eventHandler: this.offerUpdatedHandler,
      triggerName: OFFER_UPDATED_SUBSCRIPTION,
    });
  }

  private offerUpdatedHandler = async (offer: OfferDto) => {
    try {
      if (!offer.hubSpotDealId) {
        return;
      }

      await this.offerHubSpotService.updateDeal(offer);
    } catch (err) {
      this.logger.error(err);
    }
  };

  private offerCreatedHandler = async (offer: OfferDto) => {
    try {
      await this.offerHubSpotService.createDeal(offer);
    } catch (err) {
      this.logger.error(err);
    }
  };
}
