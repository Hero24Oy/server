import { PaymentStatus, PurchaseInvoiceListKeys } from '../enums';

import { NetvisorPurchaseInvoice } from './purchase-invoice';

export interface PurchaseInvoiceListParameters {
  [PurchaseInvoiceListKeys.PAYMENT_STATUS]: PaymentStatus;
}

export interface NetvisorPurchaseInvoiceListResponse {
  Root: {
    PurchaseInvoiceList: [
      {
        PurchaseInvoice: NetvisorPurchaseInvoice[];
      },
    ];
  };
}
