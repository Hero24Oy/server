/* eslint-disable @typescript-eslint/naming-convention -- we need disable this rule for headers */

export enum NetvisorEndpoint {
  PURCHASE_INVOICE_LIST = 'purchaseinvoicelist.nv',
}

export interface NetvisorHeaders extends Record<string, string> {
  'Content-Type': string;
  'X-Netvisor-Authentication-CustomerId': string;
  'X-Netvisor-Authentication-MAC': string;
  'X-Netvisor-Authentication-MACHashCalculationAlgorithm': string;
  'X-Netvisor-Authentication-PartnerId': string;
  'X-Netvisor-Authentication-Sender': string;
  'X-Netvisor-Authentication-Timestamp': string;
  'X-Netvisor-Authentication-TransactionId': string;
  'X-Netvisor-Interface-Language': string;
  'X-Netvisor-Organisation-Id': string;
}

export type NetvisorBaseHeaders = Pick<
  NetvisorHeaders,
  | 'Content-Type'
  | 'X-Netvisor-Authentication-CustomerId'
  | 'X-Netvisor-Authentication-MACHashCalculationAlgorithm'
  | 'X-Netvisor-Authentication-PartnerId'
  | 'X-Netvisor-Authentication-Sender'
  | 'X-Netvisor-Interface-Language'
  | 'X-Netvisor-Organisation-Id'
>;

export interface NetvisorPurchaseInvoice {
  InvoiceDate: [{ $: { format: string }; _: string }];
  InvoiceNumber: [string];
  NetvisorKey: [string];
  OpenSum: [string];
  Payments: [string];
  Sum: [string];
  Uri: [string];
  Vendor: [string];
  VendorOrganizationIdentifier: [string];
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

export interface ScheduleFetchDay {
  day: number;
  transform: number;
}
