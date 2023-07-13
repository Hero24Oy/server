import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { isEqual } from 'lodash';
import { PubSub } from 'graphql-subscriptions';
import { ApiException } from '@hubspot/api-client/lib/codegen/crm/contacts';

import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from './user.constants';
import { UserUpdatedDto } from './dto/subscriptions/user-updated.dto';
import { UserDto } from './dto/user/user.dto';
import { UserCreatedDto } from './dto/subscriptions/user-created.dto';
import { SubscriptionService } from '../subscription-manager/subscription-manager.interface';
import { HubSpotContactService } from '../hub-spot/hub-spot-contact/hub-spot-contact.service';
import { UserService } from './user.service';
import { HubSpotContactProperties } from '../hub-spot/hub-spot-contact/hub-spot-contact.types';

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

  private async createOrUpdateContact(user: UserDto) {
    const properties: HubSpotContactProperties = {
      email: user.data.email,
      firstname: user.data.firstName || '',
      lastname: user.data.lastName || '',
    };

    try {
      const { hubSpotContactId, id: userId } = user;

      if (hubSpotContactId) {
        await this.hubSpotContactService.updateContact(
          hubSpotContactId,
          properties,
        );

        return;
      }

      const { id: contactId } = await this.hubSpotContactService.createContact(
        properties,
      );

      await this.userService.setHubSpotContactId(userId, contactId);
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
      const { data, id: userId } = user;
      const { email } = data;

      const contact = await this.hubSpotContactService.strictFindContactByEmail(
        email,
      );

      const { id: contactId } = contact;

      await this.userService.setHubSpotContactId(userId, contactId);
      await this.createOrUpdateContact({
        ...user,
        hubSpotContactId: contactId,
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
