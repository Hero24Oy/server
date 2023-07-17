import { ModuleMetadata } from '@nestjs/common';

import { ParentType } from '../common/common.types';
import { SubscriptionService } from './subscription-manager.interface';

export type SubscriptionRegistrationOptions = {
  subscriptions: ParentType<SubscriptionService>[];
  imports?: ModuleMetadata['imports'];
};
