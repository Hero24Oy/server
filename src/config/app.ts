import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  PORT: Joi.number().required(),
});

export default () => ({
  port: +process.env.PORT,
});
