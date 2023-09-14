import { FeeListOrderColumn } from '../dto/fee-list/fee-list-order-column.enum';
import { FeeListComparePicker } from '../fee.types';

import { amountPaidComparePicker } from './amount-paid.compare-picker';
import { createdAtComparePicker } from './created-at.compare-picker';
import { customerVATComparePicker } from './customer-vat.compare-picker';
import { feeCategoryComparePicker } from './fee-category.compare-picker';
import { offerRequestIdComparePicker } from './offer-request-id.compare-picker';
import { platformFeePercentageComparePicker } from './platform-fee-percentage.compare-picker';
import { serviceProviderVATComparePicker } from './service-provider-vat.compare-picker';
import { statusComparePicker } from './status.compare-picker';
import { userIdComparePicker } from './user-id.compare-picker';

export const FEE_SORTERS: Record<FeeListOrderColumn, FeeListComparePicker> = {
  [FeeListOrderColumn.CREATED_AT]: createdAtComparePicker,
  [FeeListOrderColumn.AMOUNT_PAID]: amountPaidComparePicker,
  [FeeListOrderColumn.CUSTOMER_VAT]: customerVATComparePicker,
  [FeeListOrderColumn.FEE_CATEGORY]: feeCategoryComparePicker,
  [FeeListOrderColumn.OFFER_REQUEST_ID]: offerRequestIdComparePicker,
  [FeeListOrderColumn.PLATFORM_FEE_PERCENTAGE]:
    platformFeePercentageComparePicker,
  [FeeListOrderColumn.SERVICE_PROVIDER_VAT]: serviceProviderVATComparePicker,
  [FeeListOrderColumn.STATUS]: statusComparePicker,
  [FeeListOrderColumn.USED_ID]: userIdComparePicker,
};
