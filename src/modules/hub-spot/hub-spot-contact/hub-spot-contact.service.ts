import { Injectable } from '@nestjs/common';

import { HubSpotClientService } from '../hub-spot-client/hub-spot-client.service';
import {
  HubSpotContactAssociationsForObject,
  HubSpotContactObject,
  HubSpotContactProperties,
} from './hub-spot-contact.types';

@Injectable()
export class HubSpotContactService {
  constructor(private hubSpotClientService: HubSpotClientService) {}

  async createContact(
    properties: HubSpotContactProperties,
    associations: HubSpotContactAssociationsForObject[] = [],
  ): Promise<HubSpotContactObject> {
    return this.hubSpotClientService.client.crm.contacts.basicApi.create({
      properties,
      associations,
    });
  }

  async updateContact(
    contactId: string,
    properties: HubSpotContactProperties,
  ): Promise<HubSpotContactObject> {
    return this.hubSpotClientService.client.crm.contacts.basicApi.update(
      contactId,
      {
        properties,
      },
    );
  }

  async findContactByEmail(
    email: string,
  ): Promise<HubSpotContactObject | null> {
    const response =
      await this.hubSpotClientService.client.crm.contacts.searchApi.doSearch({
        sorts: [],
        properties: [],
        limit: 1,
        after: 0,
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
      });

    const { total, results } = response;

    if (total !== 1) {
      return null;
    }

    return results[0];
  }

  async strictFindContactByEmail(email: string): Promise<HubSpotContactObject> {
    const contact = await this.findContactByEmail(email);

    if (!contact) {
      throw new Error(`Contact with email ${email} is not found`);
    }

    return contact;
  }
}
