import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { N8nWebhookManagerService } from './n8n-webhook-manager.service';
import { ParentType } from '../common/common.types';
import { N8nWebhookSubscriptionService } from './n8n-webhook-manager.interface';
import { SubscriptionRegistrationOptions } from './n8n-webhook-manager.types';

@Module({})
export class N8nWebhookManagerModule {
  static unsubscribe: () => Promise<void>;

  private static imports: Required<ModuleMetadata>['imports'] = [];
  private static n8nWebhookSubscriptionProviders: ParentType<N8nWebhookSubscriptionService>[] =
    [];

  static forFeature(options: SubscriptionRegistrationOptions): DynamicModule {
    const { subscriptions, imports = [] } = options;
    N8nWebhookManagerModule.n8nWebhookSubscriptionProviders.push(
      ...subscriptions,
    );

    N8nWebhookManagerModule.imports.push(...imports);

    return {
      module: N8nWebhookManagerModule,
      imports,
      providers: subscriptions,
      exports: subscriptions,
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: N8nWebhookManagerModule,
      imports: N8nWebhookManagerModule.imports,
      providers: [
        {
          provide: N8nWebhookManagerService,
          inject: N8nWebhookManagerModule.n8nWebhookSubscriptionProviders,
          useFactory: (
            ...contextProviders: N8nWebhookSubscriptionService[]
          ) => {
            return new N8nWebhookManagerService(...contextProviders);
          },
        },
        ...N8nWebhookManagerModule.n8nWebhookSubscriptionProviders,
      ],
      exports: [
        {
          provide: N8nWebhookManagerService,
          useExisting: N8nWebhookManagerService,
        },
      ],
    };
  }
}
