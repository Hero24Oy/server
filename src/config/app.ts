import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  PORT: Joi.number().required(),
});

export default () => ({
  port: +(process.env.PORT as string),
  isDevelopment: process.env.NODE_ENV !== 'production',
});
