/* eslint-disable @typescript-eslint/naming-convention */
import * as Joi from 'joi';

export const hubSpotValidationSchema = Joi.object({
  HUB_SPOT_ACCESS_TOKEN: Joi.string().required(),
  HUB_SPOT_DEAL_OWNER_ID: Joi.string().required(),
  HUB_SPOT_DISABLED: Joi.string().allow('true', 'false').only().required(),
});

export default () => ({
  accessToken: process.env.HUB_SPOT_ACCESS_TOKEN,
  dealOwner: process.env.HUB_SPOT_DEAL_OWNER_ID,
  disabled: process.env.HUB_SPOT_DISABLED === 'true',
});
