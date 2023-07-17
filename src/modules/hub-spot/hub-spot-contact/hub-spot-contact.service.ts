import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiException } from '@hubspot/api-client/lib/codegen/crm/contacts';

import { MaybeType } from 'src/modules/common/common.types';

import { HubSpotClientService } from '../hub-spot-client/hub-spot-client.service';
import {
  HubSpotContactAssociationsForObject,
  HubSpotContactObject,
  HubSpotContactProperties,
} from './hub-spot-contact.types';

@Injectable()
export class HubSpotContactService {
  constructor(private hubSpotClientService: HubSpotClientService) {}

  async upsertContact(
    properties: HubSpotContactProperties,
    contactId?: MaybeType<string>,
    associations: HubSpotContactAssociationsForObject[] = [],
  ) {
    try {
      if (contactId) {
        return await this.updateContact(contactId, properties);
      }

      return await this.createContact(properties, associations);
    } catch (err) {
      const error = err as ApiException<unknown>;

      if (error.code === HttpStatus.CONFLICT) {
        const contact = await this.strictFindContactByEmail(properties.email);

        return this.updateContact(contact.id, properties);
      }

      throw err;
    }
  }

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
