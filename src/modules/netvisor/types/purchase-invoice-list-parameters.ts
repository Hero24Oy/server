import { PaymentStatus, PurchaseInvoiceListKeys } from '../enums';

export interface PurchaseInvoiceListParameters {
  [PurchaseInvoiceListKeys.PAYMENT_STATUS]: PaymentStatus;
}
