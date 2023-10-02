import { NetvisorHeaders } from './headers.type';
import { NetvisorHeadersName } from './headers-name.type';

export type NetvisorBaseHeaders = Pick<
  NetvisorHeaders,
  | NetvisorHeadersName.CONTENT_TYPE
  | NetvisorHeadersName.CUSTOMER_ID
  | NetvisorHeadersName.ALGORITHM
  | NetvisorHeadersName.PARTNER_ID
  | NetvisorHeadersName.SENDER
  | NetvisorHeadersName.LANGUAGE
  | NetvisorHeadersName.ORGANISATION_ID
>;
