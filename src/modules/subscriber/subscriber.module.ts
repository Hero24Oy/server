import { Module } from '@nestjs/common';

import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';
import { SubscriptionManagerService } from '../subscription-manager/subscription-manager.service';

@Module({
  imports: [SubscriptionManagerModule.forRoot()],
})
export class SubscriberModule {
  private unsubscribe: () => Promise<void>;

  constructor(private subscriptionManagerService: SubscriptionManagerService) {}

  async onApplicationBootstrap() {
    this.unsubscribe = await this.subscriptionManagerService.subscribe();
  }

  async beforeApplicationShutdown() {
    await this.unsubscribe();
  }
}
