import { OldPaymentTransaction, PaymentTransaction } from 'hero24-types';

export const isNewTransaction = (
  transaction: OldPaymentTransaction | PaymentTransaction,
): transaction is PaymentTransaction => {
  return 'type' in transaction;
};
