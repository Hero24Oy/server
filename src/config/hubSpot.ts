import * as Joi from 'joi';

export const hubSpotValidationSchema = Joi.object({
  HUB_SPOT_ACCESS_TOKEN: Joi.string()
    .regex(/[^/]$/, "Shouldn't end with '/'")
    .required(),
  HUB_SPOT_DEAL_OWNER_ID: Joi.string().required(),
});

export default () => ({
  accessToken: process.env.HUB_SPOT_ACCESS_TOKEN,
  dealOwner: process.env.HUB_SPOT_DEAL_OWNER_ID,
});
