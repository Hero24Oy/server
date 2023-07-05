import axios, { isAxiosError } from 'axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isEqual } from 'lodash';
import { PubSub } from 'graphql-subscriptions';

import { N8nWebhookSubscriptionService } from '../n8n-webhook-manager/n8n-webhook-manager.interface';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';
import {
  USER_CREATED_SUBSCRIPTION,
  USER_UPDATED_SUBSCRIPTION,
} from './user.constants';
import { UserUpdatedDto } from './dto/subscriptions/user-updated.dto';
import { UserDto } from './dto/user/user.dto';
import { UserCreatedDto } from './dto/subscriptions/user-created.dto';

@Injectable()
export class UserN8nSubscription implements N8nWebhookSubscriptionService {
  private logger = new Logger(UserN8nSubscription.name);
  private templateWebhookUrl: string;

  constructor(
    private configService: ConfigService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {
    const baseUrl = this.configService.getOrThrow<string>('n8n.webhookUrl');
    const contactCreationPath = this.configService.getOrThrow<string>(
      'n8n.contactCreationWebhookPath',
    );

    this.templateWebhookUrl = `${baseUrl}${contactCreationPath}`;
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

        if (this.shouldCallWebhook(user, beforeUpdateUser)) {
          this.callWebhook(user.id);
        }
      },
    );
  }

  private async subscribeOnUserCreation() {
    return this.pubSub.subscribe(
      USER_CREATED_SUBSCRIPTION,
      (data: Record<typeof USER_CREATED_SUBSCRIPTION, UserCreatedDto>) => {
        const { user } = data[USER_CREATED_SUBSCRIPTION];
        this.callWebhook(user.id);
      },
    );
  }

  private async callWebhook(userId: string) {
    try {
      if (!userId) {
        throw new Error('User id should be provided');
      }

      const webhookUrl = this.templateWebhookUrl.replace(':userId', userId);

      await axios.get(webhookUrl);
    } catch (err) {
      const error = err as Error;

      if (isAxiosError(error)) {
        this.logger.error(error.response?.data);
        return;
      }

      this.logger.error(error);
    }
  }

  private shouldCallWebhook(user: UserDto, previous: UserDto) {
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
