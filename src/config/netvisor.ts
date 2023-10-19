import { isValidCron } from 'cron-validator';
import * as Joi from 'joi';

export const netvisorValidationSchema = Joi.object({
  NETVISOR_BASE_URL: Joi.string().required(),
  NETVISOR_ORG_ID: Joi.string().required(),
  NETVISOR_CUSTOMER_ID: Joi.string().required(),
  NETVISOR_CUSTOMER_KEY: Joi.string().required(),
  NETVISOR_PARTNER_ID: Joi.string().required(),
  NETVISOR_PARTNER_KEY: Joi.string().required(),
  NETVISOR_SENDER: Joi.string().required(),
  NETVISOR_FETCH_CRON: Joi.string()
    .required()
    .custom((value: string, helper) => {
      if (!isValidCron(value, { seconds: true })) {
        throw helper.error('any.custom');
      }

      return value;
    }, 'Netvisor fetch cron is invalid'),
});

export default () => ({
  baseUrl: process.env.NETVISOR_BASE_URL,
  orgId: process.env.NETVISOR_ORG_ID,
  customerId: process.env.NETVISOR_CUSTOMER_ID,
  customerKey: process.env.NETVISOR_CUSTOMER_KEY,
  partnerId: process.env.NETVISOR_PARTNER_ID,
  partnerKey: process.env.NETVISOR_PARTNER_KEY,
  sender: process.env.NETVISOR_SENDER,
  cron: process.env.NETVISOR_FETCH_CRON,
});
