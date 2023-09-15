import * as HubSpot from '@hubspot/api-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HubSpotClientService {
  public readonly client: HubSpot.Client;

  constructor(configService: ConfigService) {
    const accessToken = configService.getOrThrow<string>('hubSpot.accessToken');

    this.client = new HubSpot.Client({
      accessToken,
    });
  }
}
