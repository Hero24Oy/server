import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { SubscriptionManagerService } from './subscription-manager.service';
import { ParentType } from '../common/common.types';
import { SubscriptionService } from './subscription-manager.interface';
import { SubscriptionRegistrationOptions } from './subscription-manager.types';
import { SUBSCRIPTIONS_PROVIDER } from './subscription-manager.constants';

@Module({})
export class SubscriptionManagerModule {
  private static imports: Required<ModuleMetadata>['imports'] = [];
  private static subscriptions: ParentType<SubscriptionService>[] = [];
  private static providers: Provider[] = [
    SubscriptionManagerService,
    {
      provide: SUBSCRIPTIONS_PROVIDER,
      useFactory: (...subscriptions) => subscriptions,
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
