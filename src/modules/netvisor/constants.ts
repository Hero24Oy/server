import {
  NetvisorAccountKeys,
  NetvisorAccountParameters,
  PaymentStatus,
  PurchaseInvoiceListKeys,
  PurchaseInvoiceListParameters,
  ScheduleFetchDay,
} from './types';
import { Methods } from './types/methods';

export const UPDATE_PAID_STATUS_CRON_TIME = '0 0 12 * * 2,5'; // Tuesday and Friday at 12:00

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

export const jsToXmlOptions = { compact: true, spaces: 2 };

export const COUNTRY_ISO = 'ISO-3166';

export const createNetvisorAccountParameters = {
  [NetvisorAccountKeys.METHOD]: Methods.ADD,
} satisfies NetvisorAccountParameters;

export const editNetvisorAccountParameters = {
  [NetvisorAccountKeys.METHOD]: Methods.EDIT,
} satisfies NetvisorAccountParameters;
