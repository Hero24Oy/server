import * as Joi from 'joi';

let FETCH_DAY_MESSAGE = '';
FETCH_DAY_MESSAGE += 'Fetch day must be: \n';
FETCH_DAY_MESSAGE += '1. A number in the range 1-7 \n';
FETCH_DAY_MESSAGE += '2. Range x-y (x = 1...6, y = 1...6, x < y) \n';
FETCH_DAY_MESSAGE +=
  '3. Numbers in the range from 1 to 6 separated by commas(1,3,5)\n';
FETCH_DAY_MESSAGE += '4. * for all days';

export const netvisorValidationSchema = Joi.object({
  NETVISOR_BASE_URL: Joi.string().required(),
  NETVISOR_ORG_ID: Joi.string().required(),
  NETVISOR_CUSTOMER_ID: Joi.string().required(),
  NETVISOR_CUSTOMER_KEY: Joi.string().required(),
  NETVISOR_PARTNER_ID: Joi.string().required(),
  NETVISOR_PARTNER_KEY: Joi.string().required(),
  NETVISOR_SENDER: Joi.string().required(),
  NETVISOR_FETCH_DAY: Joi.string()
    .pattern(/^[1-7]$|^[1-7]-[1-6]$|^([1-6],|[1-6]){1,6}$|^\*$/)
    .required()
    .messages({
      'string.pattern.base': FETCH_DAY_MESSAGE,
    }),
  NETVISOR_FETCH_HOURS: Joi.string()
    .pattern(/^([1-9]|1[0-9]|2[0-4])$/)
    .required()
    .messages({
      'string.pattern.base': 'Fetch time must be a number in the range 1-24',
    }),
});

export default () => ({
  baseUrl: process.env.NETVISOR_BASE_URL,
  orgId: process.env.NETVISOR_ORG_ID,
  customerId: process.env.NETVISOR_CUSTOMER_ID,
  customerKey: process.env.NETVISOR_CUSTOMER_KEY,
  partnerId: process.env.NETVISOR_PARTNER_ID,
  partnerKey: process.env.NETVISOR_PARTNER_KEY,
  sender: process.env.NETVISOR_SENDER,
  cron: `0 0 ${process.env.NETVISOR_FETCH_HOURS} * * ${process.env.NETVISOR_FETCH_DAY}`,
});
