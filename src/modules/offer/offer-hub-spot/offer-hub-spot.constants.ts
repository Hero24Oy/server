import { OFFER_STATUS } from 'hero24-types';

import { HubSpotDealStage } from '$/src/modules/hub-spot/hub-spot-deal/hub-spot-deal.constants/hub-spot-deal-stage.constant';

export const HUB_SPOT_DEAL_STAGE_BY_OFFER_STATUS = {
  open: HubSpotDealStage.OPEN,
  accepted: HubSpotDealStage.ACCEPTED,
  completed: HubSpotDealStage.COMPLETED,
  cancelled: HubSpotDealStage.CANCELLED,
  expired: HubSpotDealStage.EXPIRED,
} satisfies Record<OFFER_STATUS, HubSpotDealStage>;
