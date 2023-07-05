import { ModuleMetadata } from '@nestjs/common';

import { ParentType } from '../common/common.types';
import { N8nWebhookSubscriptionService } from './n8n-webhook-manager.interface';

export type SubscriptionRegistrationOptions = {
  subscriptions: ParentType<N8nWebhookSubscriptionService>[];
  imports?: ModuleMetadata['imports'];
};
