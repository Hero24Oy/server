import { NetvisorHeadersName } from './headers-name';

export interface NetvisorHeaders extends Record<string, string> {
  [NetvisorHeadersName.CONTENT_TYPE]: string;
  [NetvisorHeadersName.CUSTOMER_ID]: string;
  [NetvisorHeadersName.MAC]: string;
  [NetvisorHeadersName.ALGORITHM]: string;
  [NetvisorHeadersName.PARTNER_ID]: string;
  [NetvisorHeadersName.SENDER]: string;
  [NetvisorHeadersName.TIMESTAMP]: string;
  [NetvisorHeadersName.TRANSACTION_ID]: string;
  [NetvisorHeadersName.LANGUAGE]: string;
  [NetvisorHeadersName.ORGANISATION_ID]: string;
}
