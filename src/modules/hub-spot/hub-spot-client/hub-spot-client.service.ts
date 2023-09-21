import * as HubSpot from '@hubspot/api-client';
import { Inject, Injectable } from '@nestjs/common';

import { Config, configProvider } from '$config';

@Injectable()
export class HubSpotClientService {
  public readonly client: HubSpot.Client;

  constructor(
    @Inject(configProvider)
    private readonly config: Config,
  ) {
    const { accessToken } = this.config.hubSpot;

    this.client = new HubSpot.Client({
      accessToken,
    });
  }
}
