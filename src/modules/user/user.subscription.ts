import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { isEqual } from 'lodash';
import { PubSub } from 'graphql-subscriptions';

import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from './user.constants';
import { UserUpdatedDto } from './dto/subscriptions/user-updated.dto';
import { UserDto } from './dto/user/user.dto';
import { UserCreatedDto } from './dto/subscriptions/user-created.dto';
import { SubscriptionService } from '../subscription-manager/subscription-manager.interface';
import { HubSpotService } from '../hub-spot/hub-spot.service';
import { UserService } from './user.service';
import { ApiException } from '@hubspot/api-client/lib/codegen/crm/contacts';

@Injectable()
export class UserSubscription implements SubscriptionService {
  private logger = new Logger(UserSubscription.name);

  constructor(
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
    private hubSpotService: HubSpotService,
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

  private async createOrUpdateContact(user: UserDto) {
    try {
      const { hubSpotContactId } = user;

      const properties = {
        email: user.data.email,
        firstname: user.data.firstName || '',
        lastname: user.data.lastName || '',
      };

      if (hubSpotContactId) {
        await this.hubSpotService.client.crm.contacts.basicApi.update(
          hubSpotContactId,
          { properties },
        );
        return;
      }

      const { id } =
        await this.hubSpotService.client.crm.contacts.basicApi.create({
          properties,
          associations: [],
        });

      await this.userService.setHubSpotContactId(user.id, id);
    } catch (err) {
      const error = err as ApiException<unknown>;

      if (error.code === HttpStatus.CONFLICT) {
        return this.handleAlreadyExistContactConflict(user);
      }

      this.logger.error(error);
    }
  }

  private async handleAlreadyExistContactConflict(user: UserDto) {
    try {
      const hubSpotClient = this.hubSpotService.client;

      const { total, results } =
        await hubSpotClient.crm.contacts.searchApi.doSearch({
          sorts: [],
          properties: [],
          limit: 1,
          after: 0,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: user.data.email,
                },
              ],
            },
          ],
        });

      if (total !== 1) {
        return;
      }

      const [contact] = results;

      await this.userService.setHubSpotContactId(user.id, contact.id);
      await this.createOrUpdateContact({
        ...user,
        hubSpotContactId: contact.id,
      });
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
