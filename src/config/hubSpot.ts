import * as Joi from 'joi';

export const hubSpotValidationSchema = Joi.object({
  HUB_SPOT_ACCESS_TOKEN: Joi.string()
    .regex(/[^/]$/, "Shouldn't end with '/'")
    .required(),
});

export default () => ({
  accessToken: process.env.HUB_SPOT_ACCESS_TOKEN,
});
