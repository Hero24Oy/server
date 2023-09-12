import { ModuleMetadata } from '@nestjs/common';

import { ParentType } from '../common/common.types';

// TODO: Resolve cycle dependency
// eslint-disable-next-line import/no-cycle
import { SubscriptionService } from './subscription-manager.interface';

export type SubscriptionRegistrationOptions = {
  subscriptions: ParentType<SubscriptionService>[];
  imports?: ModuleMetadata['imports'];
};

export type Unsubscribe = () => Promise<void> | void;
