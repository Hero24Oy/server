import * as Joi from 'joi';

export const environmentValidationSchema = Joi.object({
  PLATFORM_FEE: Joi.number().required().min(0).max(100),
});

export default () => ({
  platformFeeInPercents: process.env.PLATFORM_FEE,
});
