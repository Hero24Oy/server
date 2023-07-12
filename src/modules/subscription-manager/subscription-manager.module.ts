import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { SubscriptionManagerService } from './subscription-manager.service';
import { ParentType } from '../common/common.types';
import { SubscriptionService } from './subscription-manager.interface';
import { SubscriptionRegistrationOptions } from './subscription-manager.types';

@Module({})
export class SubscriptionManagerModule {
  private static imports: Required<ModuleMetadata>['imports'] = [];
  private static subscriptionProviders: ParentType<SubscriptionService>[] = [];

  static forFeature(options: SubscriptionRegistrationOptions): DynamicModule {
    const { subscriptions, imports = [] } = options;
    SubscriptionManagerModule.subscriptionProviders.push(...subscriptions);

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
      providers: [
        {
          provide: SubscriptionManagerService,
          inject: SubscriptionManagerModule.subscriptionProviders,
          useFactory: (...contextProviders: SubscriptionService[]) => {
            return new SubscriptionManagerService(...contextProviders);
          },
        },
        ...SubscriptionManagerModule.subscriptionProviders,
      ],
      exports: [
        {
          provide: SubscriptionManagerService,
          useExisting: SubscriptionManagerService,
        },
      ],
    };
  }
}
