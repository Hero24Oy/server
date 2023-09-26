import * as HubSpot from '@hubspot/api-client';
import { Injectable } from '@nestjs/common';

import { ConfigType } from '$config';
import { Config } from '$decorator';

@Injectable()
export class HubSpotClientService {
  public readonly client: HubSpot.Client;

  constructor(
    @Config()
    private readonly config: ConfigType,
  ) {
    const { accessToken } = this.config.hubSpot;

    this.client = new HubSpot.Client({
      accessToken,
    });
  }
}
