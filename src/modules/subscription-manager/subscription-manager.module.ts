import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';

import { ParentType } from '../common/common.types';

import { SUBSCRIPTIONS_PROVIDER } from './subscription-manager.constants';
import { SubscriptionManagerService } from './subscription-manager.service';
import {
  SubscriptionRegistrationOptions,
  SubscriptionService,
} from './subscription-manager.types';

@Module({})
export class SubscriptionManagerModule {
  private static imports: Required<ModuleMetadata>['imports'] = [];

  private static subscriptions: ParentType<SubscriptionService>[] = [];

  private static providers: Provider[] = [
    SubscriptionManagerService,
    {
      provide: SUBSCRIPTIONS_PROVIDER,
      useFactory: (...subscriptions: SubscriptionService[]) =>
        subscriptions.filter((subscription) => !subscription.disabled?.()),
      inject: SubscriptionManagerModule.subscriptions,
    },
  ];

  static forFeature(options: SubscriptionRegistrationOptions): DynamicModule {
    const { subscriptions, imports = [] } = options;

    SubscriptionManagerModule.subscriptions.push(...subscriptions);
    SubscriptionManagerModule.providers.push(...subscriptions);
    SubscriptionManagerModule.imports.push(...imports);

    return {
      module: SubscriptionManagerModule,
      imports,
      providers: subscriptions,
      exports: subscriptions,
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: SubscriptionManagerModule,
      imports: SubscriptionManagerModule.imports,
      providers: SubscriptionManagerModule.providers,
      exports: [SubscriptionManagerService],
    };
  }
}
