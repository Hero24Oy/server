import {
  PaymentStatus,
  PurchaseInvoiceListKeys,
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
