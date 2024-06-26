export enum Countries {
  FINLAND = 'FI',
}

export enum NetvisorEndpoint {
  PURCHASE_INVOICE_LIST = 'purchaseinvoicelist.nv',
  VENDOR = 'vendor.nv',
}

export enum NetvisorHeadersName {
  CONTENT_TYPE = 'Content-Type',
  CUSTOMER_ID = 'X-Netvisor-Authentication-CustomerId',
  MAC = 'X-Netvisor-Authentication-MAC',
  ALGORITHM = 'X-Netvisor-Authentication-MACHashCalculationAlgorithm',
  PARTNER_ID = 'X-Netvisor-Authentication-PartnerId',
  SENDER = 'X-Netvisor-Authentication-Sender',
  TIMESTAMP = 'X-Netvisor-Authentication-Timestamp',
  TRANSACTION_ID = 'X-Netvisor-Authentication-TransactionId',
  LANGUAGE = 'X-Netvisor-Interface-Language',
  ORGANISATION_ID = 'X-Netvisor-Organisation-Id',
}

export enum Methods {
  ADD = 'add',
  EDIT = 'edit',
}

export enum NetvisorAccountKeys {
  METHOD = 'method',
}

export enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export enum PurchaseInvoiceListKeys {
  PAYMENT_STATUS = 'paymentstatus',
}
