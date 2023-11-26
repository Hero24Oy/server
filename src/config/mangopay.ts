import * as Joi from 'joi';

export const mangopayValidationSchema = Joi.object({
  MANGOPAY_BASE_URL: Joi.string().required(),
  MANGOPAY_CLIENT_ID: Joi.string().required(),
  MANGOPAY_API_KEY: Joi.string().required(),
  MANGOPAY_PAYMENT_LINK_SECRET: Joi.string().required(),
  MANGOPAY_LINK_EXPIRE_TIME: Joi.string().regex(/^\d+$/).required(),
});

export default () => ({
  baseUrl: process.env.MANGOPAY_BASE_URL,
  clientId: process.env.MANGOPAY_CLIENT_ID,
  clientApiKey: process.env.MANGOPAY_API_KEY,
  paymentLinkSecret: process.env.MANGOPAY_PAYMENT_LINK_SECRET,
  linkExpireTime: Number(process.env.MANGOPAY_LINK_EXPIRE_TIME),
});
