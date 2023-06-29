import * as Joi from 'joi';

export const n8nValidationSchema = Joi.object({
  N8N_WEBHOOK_URL: Joi.string()
    .regex(/[^/]$/, "Shouldn't end with '/'")
    .required(),
  N8N_CONTACT_CREATION_WEBHOOK_PATH: Joi.string()
    .regex(/:userId/, 'Should contain :userId')
    .regex(/^\//, "Should start with '/'")
    .required(),
});

export default () => ({
  webhookUrl: process.env.N8N_WEBHOOK_URL,
  contactCreationWebhookPath: process.env.N8N_CONTACT_CREATION_WEBHOOK_PATH,
});
