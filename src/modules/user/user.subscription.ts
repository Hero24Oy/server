import { Inject, Injectable, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { isEqual } from 'lodash';

import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import { SubscriptionService } from '../subscription-manager/subscription-manager.interface';
import { HubSpotContactService } from '../hub-spot/hub-spot-contact/hub-spot-contact.service';
import { HubSpotContactProperties } from '../hub-spot/hub-spot-contact/hub-spot-contact.types';
import { UserUpdatedDto } from './dto/subscriptions/user-updated.dto';
import { UserDto } from './dto/user/user.dto';
import { UserCreatedDto } from './dto/subscriptions/user-created.dto';
import { UserService } from './user.service';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from './user.constants';

@Injectable()
export class UserSubscription implements SubscriptionService {
  private logger = new Logger(UserSubscription.name);

  constructor(
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
    private hubSpotContactService: HubSpotContactService,
    private userService: UserService,
  ) {}

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

        if (this.shouldUpdateContact(user, beforeUpdateUser)) {
          this.createOrUpdateContact(user);
        }
      },
    );
  }

  private async subscribeOnUserCreation() {
    return this.pubSub.subscribe(
      USER_CREATED_SUBSCRIPTION,
      (data: Record<typeof USER_CREATED_SUBSCRIPTION, UserCreatedDto>) => {
        const { user } = data[USER_CREATED_SUBSCRIPTION];

        this.createOrUpdateContact(user);
      },
    );
  }

  private async createOrUpdateContact(user: UserDto): Promise<void> {
    const properties: HubSpotContactProperties = {
      email: user.data.email,
      firstname: user.data.firstName || '',
      lastname: user.data.lastName || '',
    };

    try {
      const contact = await this.hubSpotContactService.upsertContact(
        properties,
        user.hubSpotContactId,
      );

      await this.userService.setHubSpotContactId(user.id, contact.id);
    } catch (err) {
      this.logger.error(err);
    }
  }

  private shouldUpdateContact(user: UserDto, previous: UserDto) {
    return !isEqual(
      this.getCompareValues(user),
      this.getCompareValues(previous),
    );
  }

  private getCompareValues = (compareUser: UserDto) => [
    compareUser.data.email,
    compareUser.data.firstName,
    compareUser.data.lastName,
  ];
}
