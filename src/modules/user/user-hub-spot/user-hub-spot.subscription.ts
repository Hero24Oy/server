import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from 'graphql-subscriptions';

import { HubSpotSubscription } from 'src/modules/hub-spot/hub-spot-subscription.interface';

import { PUBSUB_PROVIDER } from '../../graphql-pubsub/graphql-pubsub.constants';
import { UserUpdatedDto } from '../dto/subscriptions/user-updated.dto';
import { UserCreatedDto } from '../dto/subscriptions/user-created.dto';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from '../user.constants';
import { UserHubSpotService } from './user-hub-spot.service';
import { subscribeToEvent } from 'src/modules/graphql-pubsub/graphql-pubsub.utils';

@Injectable()
export class UserHubSpotSubscription extends HubSpotSubscription {
  constructor(
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
    private userHubSpotService: UserHubSpotService,
    protected configService: ConfigService,
  ) {
    super();
  }

  public async subscribe(): Promise<() => void> {
    const unsubscribes = await Promise.all([
      this.subscribeOnUserUpdates(),
      this.subscribeOnUserCreation(),
    ]);

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  private async subscribeOnUserUpdates() {
    return subscribeToEvent({
      pubSub: this.pubSub,
      eventHandler: this.userUpdatedHandler,
      triggerName: USER_UPDATED_SUBSCRIPTION,
    });
  }

  private userUpdatedHandler = async ({
    user,
    beforeUpdateUser,
  }: UserUpdatedDto) => {
    if (this.userHubSpotService.shouldUpdateContact(user, beforeUpdateUser)) {
      this.userHubSpotService.upsertContact(user);
    }
  };

  private async subscribeOnUserCreation() {
    return subscribeToEvent({
      pubSub: this.pubSub,
      eventHandler: this.userCreatedHandler,
      triggerName: USER_CREATED_SUBSCRIPTION,
    });
  }

  private userCreatedHandler = async ({ user }: UserCreatedDto) => {
    this.userHubSpotService.upsertContact(user);
  };
}
