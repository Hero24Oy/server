import { registerEnumType } from '@nestjs/graphql';

export enum FeeListOrderColumn {
  OFFER_REQUEST_ID = 'offerRequestId',
  AMOUNT_PAID = 'amountPaid',
  STATUS = 'status',
  FEE_CATEGORY = 'feeCategory',
  CREATED_AT = 'createdAt',
  PLATFORM_FEE_PERCENTAGE = 'platformFeePercentage',
  CUSTOMER_VAT = 'customerVAT',
  SERVICE_PROVIDER_VAT = 'serviceProviderVAT',
  USED_ID = 'usedId',
}

registerEnumType(FeeListOrderColumn, {
  name: 'FeeListOrderColumn',
});
