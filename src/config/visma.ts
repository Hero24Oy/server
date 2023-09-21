import * as Joi from 'joi';

export const vismaValidationSchema = Joi.object({
  VISMA_PRIVATE_KEY: Joi.string().required(),
  VISMA_API_KEY: Joi.string().required(),
  VISMA_NOTIFY_ENDPOINT: Joi.string().required(),
});

export default () => ({
  privateKey: process.env.VISMA_PRIVATE_KEY,
  apiKey: process.env.VISMA_API_KEY,
  notifyEndPoint: process.env.VISMA_NOTIFY_ENDPOINT,
  ordersNumberPrefix:
    process.env.NODE_ENV === 'production' ? 'order' : 'test-order',
});
