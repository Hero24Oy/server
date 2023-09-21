import { Inject, Injectable, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { OfferDto } from '../dto/offer/offer.dto';
import {
  OFFER_CREATED_SUBSCRIPTION,
  OFFER_UPDATED_SUBSCRIPTION,
} from '../offer.constants';

import { OfferHubSpotService } from './offer-hub-spot.service';

import { Unsubscribe } from '$/modules/subscription-manager/subscription-manager.types';
import { Config, configProvider } from '$config';
import { PUBSUB_PROVIDER } from '$modules/graphql-pubsub/graphql-pubsub.constants';
import { subscribeToEvent } from '$modules/graphql-pubsub/graphql-pubsub.utils';
import { HubSpotSubscription } from '$modules/hub-spot/hub-spot-subscription.interface';

@Injectable()
export class OfferHubSpotSubscription extends HubSpotSubscription {
  private readonly logger = new Logger(OfferHubSpotSubscription.name);

  constructor(
    private readonly offerHubSpotService: OfferHubSpotService,
    @Inject(configProvider)
    protected readonly config: Config,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {
    super();
  }

  public async subscribe(): Promise<Unsubscribe> {
    const unsubscribes = [
      await this.subscribeOnOfferCreation(),
      await this.subscribeOnOfferChanges(),
    ];

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  private async subscribeOnOfferCreation(): Promise<() => void> {
    return subscribeToEvent({
      pubSub: this.pubSub,
      eventHandler: this.offerCreatedHandler,
      triggerName: OFFER_CREATED_SUBSCRIPTION,
    });
  }

  private async subscribeOnOfferChanges(): Promise<() => void> {
    return subscribeToEvent({
      pubSub: this.pubSub,
      eventHandler: this.offerUpdatedHandler,
      triggerName: OFFER_UPDATED_SUBSCRIPTION,
    });
  }

  private offerUpdatedHandler = async (offer: OfferDto): Promise<void> => {
    try {
      if (!offer.hubSpotDealId) {
        return;
      }

      await this.offerHubSpotService.updateDeal(offer);
    } catch (err) {
      this.logger.error(err);
    }
  };

  private offerCreatedHandler = async (offer: OfferDto): Promise<void> => {
    try {
      await this.offerHubSpotService.createDeal(offer);
    } catch (err) {
      this.logger.error(err);
    }
  };
}
