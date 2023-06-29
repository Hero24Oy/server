import { Module } from '@nestjs/common';
import { N8nWebhookManagerModule } from '../n8n-webhook-manager/n8n-webhook-manager.module';
import { N8nWebhookManagerService } from '../n8n-webhook-manager/n8n-webhook-manager.service';

@Module({
  imports: [N8nWebhookManagerModule.forRoot()],
})
export class N8nModule {
  constructor(private n8nWebhookManagerService: N8nWebhookManagerService) {}

  onApplicationBootstrap() {
    N8nWebhookManagerModule.unsubscribe =
      this.n8nWebhookManagerService.subscribe();
  }

  async beforeApplicationShutdown() {
    await N8nWebhookManagerModule.unsubscribe();
  }
}
