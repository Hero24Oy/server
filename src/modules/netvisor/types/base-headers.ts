import { NetvisorHeadersName } from '../enums';

import { NetvisorHeaders } from './headers';

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
