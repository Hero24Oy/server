import { PaymentStatus } from './payment-status';
import { PurchaseInvoiceListKeys } from './purchase-invoice-list-keys';

export interface PurchaseInvoiceListParameters {
  [PurchaseInvoiceListKeys.PAYMENT_STATUS]: PaymentStatus;
}
