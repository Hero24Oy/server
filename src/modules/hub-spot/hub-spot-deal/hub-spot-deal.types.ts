import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/deals';

import { HubSpotDealProperty } from './hub-spot-deal-constants';

export type HubSpotDealObject = SimplePublicObject;

export type HubSpotDealProperties = {
  [HubSpotDealProperty.AMOUNT]: string;
  [HubSpotDealProperty.SELLER_PROFILE]: string;
  [HubSpotDealProperty.BUYER_PROFILE]: string;
};
