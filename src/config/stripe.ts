import * as Joi from 'joi';

export const stripeValidationSchema = Joi.object({
  STRIPE_PRIVATE_KEY: Joi.string().required(),
  STRIPE_API_VERSION: Joi.string().required(),
});

export default () => ({
  privateKey: process.env.STRIPE_PRIVATE_KEY,
  apiVersion: process.env.STRIPE_API_VERSION,
});
