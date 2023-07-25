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

@Injectable()
export class UserHubSpotSubscription extends HubSpotSubscription {
  constructor(
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
    private userHubSpotService: UserHubSpotService,
    protected configService: ConfigService,
  ) {
    super();
  }

  public async subscribe(): Promise<() => Promise<void>> {
    const subscriptionIds = await Promise.all([
      this.subscribeOnUserUpdates(),
      this.subscribeOnUserCreation(),
    ]);

    return async () => {
      for (const subscriptionId of subscriptionIds) {
        await this.pubSub.unsubscribe(subscriptionId);
      }
    };
  }

  private async subscribeOnUserUpdates() {
    return this.pubSub.subscribe(
      USER_UPDATED_SUBSCRIPTION,
      (data: Record<typeof USER_UPDATED_SUBSCRIPTION, UserUpdatedDto>) => {
        const { user, beforeUpdateUser } = data[USER_UPDATED_SUBSCRIPTION];

        if (
          this.userHubSpotService.shouldUpdateContact(user, beforeUpdateUser)
        ) {
          this.userHubSpotService.upsertContact(user);
        }
      },
    );
  }

  private async subscribeOnUserCreation() {
    return this.pubSub.subscribe(
      USER_CREATED_SUBSCRIPTION,
      (data: Record<typeof USER_CREATED_SUBSCRIPTION, UserCreatedDto>) => {
        const { user } = data[USER_CREATED_SUBSCRIPTION];

        this.userHubSpotService.upsertContact(user);
      },
    );
  }
}
