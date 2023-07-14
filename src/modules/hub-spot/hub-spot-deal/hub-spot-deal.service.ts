import { Injectable } from '@nestjs/common';
import { AssociationTypes } from '@hubspot/api-client';

import { HubSpotClientService } from '../hub-spot-client/hub-spot-client.service';
import {
  HubSpotDealObject,
  HubSpotDealProperties,
} from './hub-spot-deal.types';
import { AssociationCategory } from '../hub-spot-assotiation/hub-spot-assotiation.constants';

@Injectable()
export class HubSpotDealService {
  constructor(private hubSpotClientService: HubSpotClientService) {}

  async createDeal(
    properties: HubSpotDealProperties,
    contactId: string,
  ): Promise<HubSpotDealObject> {
    return this.hubSpotClientService.client.crm.deals.basicApi.create({
      properties,
      associations: [
        {
          to: {
            id: contactId,
          },
          types: [
            {
              associationCategory: AssociationCategory.HUB_SPOT_DEFINED,
              associationTypeId: AssociationTypes.dealToContact,
            },
          ],
        },
      ],
    });
  }

  async updateDeal(
    dealId: string,
    properties: HubSpotDealProperties,
  ): Promise<HubSpotDealObject> {
    return this.hubSpotClientService.client.crm.deals.basicApi.update(dealId, {
      properties,
    });
  }
}
