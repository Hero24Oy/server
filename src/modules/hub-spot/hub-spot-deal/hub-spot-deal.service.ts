import { Injectable } from '@nestjs/common';
import { AssociationTypes } from '@hubspot/api-client';

import { HubSpotClientService } from '../hub-spot-client/hub-spot-client.service';
import {
  HubSpotDealObject,
  HubSpotDealProperties,
} from './hub-spot-deal.types';

@Injectable()
export class HubSpotDealService {
  constructor(private hubSpotClientService: HubSpotClientService) {}

  async createDeal(
    properties: HubSpotDealProperties,
    contactId: string,
  ): Promise<HubSpotDealObject> {
    this.hubSpotClientService.client.crm.deals.basicApi.create({
      properties,
      associations: [
        {
          to: {
            id: contactId,
          },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: AssociationTypes.dealToContact,
            },
          ],
        },
      ],
    });
    throw new Error('Error');
  }
}
