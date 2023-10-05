import { NetvisorPurchaseInvoice } from './purchase-invoice';

export interface NetvisorPurchaseInvoiceListResponse {
  Root: {
    PurchaseInvoiceList: [
      {
        PurchaseInvoice: NetvisorPurchaseInvoice[];
      },
    ];
  };
}
