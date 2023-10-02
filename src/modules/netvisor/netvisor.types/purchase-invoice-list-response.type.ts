import { NetvisorPurchaseInvoice } from './purchase-invoice.type';

export interface NetvisorPurchaseInvoiceListResponse {
  Root: {
    PurchaseInvoiceList: [
      {
        PurchaseInvoice: NetvisorPurchaseInvoice[];
      },
    ];
  };
}
