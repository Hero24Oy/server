import { ModuleMetadata } from '@nestjs/common';

import { ParentType } from '../common/common.types';

export interface SubscriptionService {
  subscribe(): Promise<Unsubscribe> | Unsubscribe;
  isDisabled?: () => boolean;
}

export type SubscriptionRegistrationOptions = {
  subscriptions: ParentType<SubscriptionService>[];
  imports?: ModuleMetadata['imports'];
};

export type Unsubscribe = () => Promise<void> | void;
