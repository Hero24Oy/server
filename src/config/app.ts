import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PORT: Joi.number().required(),
});

export default () => ({
  port: +(process.env.PORT as string),
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
});
