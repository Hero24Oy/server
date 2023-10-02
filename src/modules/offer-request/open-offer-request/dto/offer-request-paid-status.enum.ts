import { OfferRequestDB } from 'hero24-types';

export const PaidStatus = {
  WAITING: 'waiting',
  PAID: 'paid',
} satisfies Record<Uppercase<PaidStatus>, PaidStatus>;

export type PaidStatus = Exclude<
  OfferRequestDB['data']['initial']['prepaid'],
  undefined
>;
