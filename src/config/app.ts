import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  PORT: Joi.number().required(),
});

export default () => ({
  port: Number(process.env.PORT),
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
});
