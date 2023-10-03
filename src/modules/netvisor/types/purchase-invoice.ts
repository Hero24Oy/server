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
