import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/deals';

import { HubSpotDealProperty } from './hub-spot-deal.constants/hub-spot-deal-property.constant';
import { HubSpotDealStage } from './hub-spot-deal.constants/hub-spot-deal-stage.constant';
import { HubSpotDealType } from './hub-spot-deal.constants/hub-spot-deal-type.constant';

export type HubSpotDealObject = SimplePublicObject;

export type HubSpotDealProperties = {
  [HubSpotDealProperty.AMOUNT]: string;
  [HubSpotDealProperty.SELLER_PROFILE]: string;
  [HubSpotDealProperty.BUYER_PROFILE]: string;
  [HubSpotDealProperty.DURATION]: string;
  [HubSpotDealProperty.PRICE_PER_HOUR]: string;
  [HubSpotDealProperty.SERVICE_CATEGORY]: string;
  [HubSpotDealProperty.DEAL_TYPE]: HubSpotDealType;
  [HubSpotDealProperty.DEAL_OWNER]: string;
  [HubSpotDealProperty.DEAL_STAGE]: HubSpotDealStage;
  [HubSpotDealProperty.CLOSE_DATE]: string;
  [HubSpotDealProperty.ACTUAL_DURATION]: string;
  [HubSpotDealProperty.EXTRA_TIME]: string;
  [HubSpotDealProperty.MATERIAL_FEE]: string;
};
