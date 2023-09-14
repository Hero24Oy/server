import { ConfigService } from '@nestjs/config';

import {
  SubscriptionService,
  Unsubscribe,
} from '../subscription-manager/subscription-manager.types';

export abstract class HubSpotSubscription implements SubscriptionService {
  protected abstract configService: ConfigService;

  public disabled() {
    return this.configService.getOrThrow<boolean>('hubSpot.disabled');
  }

  public abstract subscribe(): Promise<Unsubscribe> | Unsubscribe;
}
