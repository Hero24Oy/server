import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import { UserCreatedDto } from '../dto/subscriptions/user-created.dto';
import { UserUpdatedDto } from '../dto/subscriptions/user-updated.dto';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from '../user.constants';

import { UserHubSpotService } from './user-hub-spot.service';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { subscribeToEvent } from '$modules/graphql-pubsub/graphql-pubsub.utils';
import { HubSpotSubscription } from '$modules/hub-spot/hub-spot-subscription.interface';
import { Unsubscribe } from '$modules/subscription-manager/subscription-manager.types';

@Injectable()
export class UserHubSpotSubscription extends HubSpotSubscription {
  constructor(
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
    private readonly userHubSpotService: UserHubSpotService,
    @Config()
    protected readonly config: ConfigType,
  ) {
    super();
  }

  public async subscribe(): Promise<Unsubscribe> {
    const unsubscribes = await Promise.all([
      this.subscribeOnUserUpdates(),
      this.subscribeOnUserCreation(),
    ]);

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  private async subscribeOnUserUpdates(): Promise<() => void> {
    return subscribeToEvent({
      pubSub: this.pubSub,
      eventHandler: this.userUpdatedHandler,
      triggerName: USER_UPDATED_SUBSCRIPTION,
    });
  }

  private userUpdatedHandler = async ({
    user,
    beforeUpdateUser,
  }: UserUpdatedDto): Promise<void> => {
    if (this.userHubSpotService.shouldUpdateContact(user, beforeUpdateUser)) {
      void this.userHubSpotService.upsertContact(user);
    }
  };

  private async subscribeOnUserCreation(): Promise<() => void> {
    return subscribeToEvent({
      pubSub: this.pubSub,
      eventHandler: this.userCreatedHandler,
      triggerName: USER_CREATED_SUBSCRIPTION,
    });
  }

  private userCreatedHandler = async ({
    user,
  }: UserCreatedDto): Promise<void> => {
    void this.userHubSpotService.upsertContact(user);
  };
}
