import {
  PublicAssociationsForObject,
  SimplePublicObject,
} from '@hubspot/api-client/lib/codegen/crm/contacts';

import { EnumToString } from '../../common/common.types';

import { HubSpotContactProperty } from './hub-spot-contact.constants';

export type HubSpotContactPropertyName = EnumToString<HubSpotContactProperty>;

export type HubSpotContactProperties = {
  [HubSpotContactProperty.EMAIL]: string;
  [HubSpotContactProperty.FIRST_NAME]: string;
  [HubSpotContactProperty.LAST_NAME]: string;
  [HubSpotContactProperty.PHONE_NUMBER]: string;
};

export type HubSpotContactObject = SimplePublicObject;

export type HubSpotContactAssociationsForObject = PublicAssociationsForObject;
