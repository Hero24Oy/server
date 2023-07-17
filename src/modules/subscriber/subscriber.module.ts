import { Module } from '@nestjs/common';
import { SubscriptionManagerService } from '../subscription-manager/subscription-manager.service';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

@Module({
  imports: [SubscriptionManagerModule.forRoot()],
})
export class SubscriberModule {
  private unsubscribe: () => void;

  constructor(private subscriptionManagerService: SubscriptionManagerService) {}

  async onApplicationBootstrap() {
    this.unsubscribe = await this.subscriptionManagerService.subscribe();
  }

  async beforeApplicationShutdown() {
    await this.unsubscribe();
  }
}
