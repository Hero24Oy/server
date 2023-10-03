import { ScheduleFetchDay } from './types';

export const UPDATE_PAID_STATUS_CRON_TIME = '0 0 12 * * 2,5'; // Tuesday and Friday at 12:00

export const purchaseInvoiceListParameters = {
  paymentstatus: 'paid',
};

export const TUESDAY = 2;
export const FRIDAY = 5;
export const FROM_TUESDAY_TO_FRIDAY = 4;
export const FROM_FRIDAY_TO_TUESDAY = 3;

export const scheduleFetchDays: ScheduleFetchDay[] = [
  { day: FRIDAY, transform: FROM_FRIDAY_TO_TUESDAY },
  { day: TUESDAY, transform: FROM_TUESDAY_TO_FRIDAY },
];
