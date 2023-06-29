import { Injectable, Logger } from '@nestjs/common';

import { N8nWebhookSubscriptionService } from '../n8n-webhook-manager/n8n-webhook-manager.interface';
import { FirebaseService } from '../firebase/firebase.service';
import { subscribeOnFirebaseEvent } from '../firebase/firebase.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { ConfigService } from '@nestjs/config';
import axios, { isAxiosError } from 'axios';
import { DataSnapshot } from 'firebase-admin/database';

@Injectable()
export class UserN8nSubscription implements N8nWebhookSubscriptionService {
  private logger = new Logger(UserN8nSubscription.name);
  private templateWebhookUrl: string;

  constructor(
    private firebaseService: FirebaseService,
    private configService: ConfigService,
  ) {
    const baseUrl = this.configService.getOrThrow<string>('n8n.webhookUrl');
    const contactCreationPath = this.configService.getOrThrow<string>(
      'n8n.contactCreationWebhookPath',
    );

    this.templateWebhookUrl = `${baseUrl}${contactCreationPath}`;
  }

  subscribe(): () => Promise<void> {
    const app = this.firebaseService.getDefaultApp();
    const usersRef = app.database().ref(FirebaseDatabasePath.USERS);

    const unsubscribe = subscribeOnFirebaseEvent(
      usersRef,
      'child_changed',
      this.firebaseEventHandler,
    );

    return async () => unsubscribe();
  }

  private firebaseEventHandler = async (snapshot: DataSnapshot) => {
    if (snapshot.key) {
      await this.callWebhook(snapshot.key);
    }
  };

  private async callWebhook(userId: string) {
    try {
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
}
