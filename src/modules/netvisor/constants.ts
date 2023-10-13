import {
  Methods,
  NetvisorAccountKeys,
  PaymentStatus,
  PurchaseInvoiceListKeys,
} from './enums';
import {
  NetvisorAccountParameters,
  PurchaseInvoiceListParameters,
  ScheduleFetchDay,
} from './types';

export const purchaseInvoiceListParameters = {
  [PurchaseInvoiceListKeys.PAYMENT_STATUS]: PaymentStatus.PAID,
} satisfies PurchaseInvoiceListParameters;

export const TUESDAY = 2;
export const FRIDAY = 5;
export const FROM_TUESDAY_TO_FRIDAY = 4;
export const FROM_FRIDAY_TO_TUESDAY = 3;

export const scheduleFetchDays: ScheduleFetchDay[] = [
  { day: FRIDAY, transform: FROM_FRIDAY_TO_TUESDAY },
  { day: TUESDAY, transform: FROM_TUESDAY_TO_FRIDAY },
];

export const NETVISOR_FETCH_JOB = 'Regular paid receipt of Netvisor status';

export const jsToXmlOptions = { compact: true, spaces: 2 };

export const COUNTRY_ISO = 'ISO-3166';

export const createNetvisorAccountParameters = {
  [NetvisorAccountKeys.METHOD]: Methods.ADD,
} satisfies NetvisorAccountParameters;

export const editNetvisorAccountParameters = {
  [NetvisorAccountKeys.METHOD]: Methods.EDIT,
} satisfies NetvisorAccountParameters;
