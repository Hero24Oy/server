import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/deals';

import { HubSpotDealProperty } from './hub-spot-deal-constants';

export type HubSpotDealObject = SimplePublicObject;

export type HubSpotDealProperties = {
  [HubSpotDealProperty.AMOUNT]: string;
  [HubSpotDealProperty.SELLER_PROFILE]: string;
  [HubSpotDealProperty.BUYER_PROFILE]: string;
  [HubSpotDealProperty.DURATION]: string;
  [HubSpotDealProperty.PRICE_PER_HOUR]: string;
  [HubSpotDealProperty.SERVICE_CATEGORY]: string;
  [HubSpotDealProperty.DEAL_TYPE]: string;
  [HubSpotDealProperty.DEAL_OWNER]: string;
  [HubSpotDealProperty.DEAL_STAGE]: string;
  [HubSpotDealProperty.CLOSE_DATE]: string;
};
