import { InputType, PickType } from '@nestjs/graphql';
import { FeeDB } from 'hero24-types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import {
  FEE_CUSTOMER_VAT,
  FEE_SERVICE_PROVIDER_VAT,
} from '../../fee.constants';
import { FeeDto } from '../fee/fee.dto';
import { FeeCategory } from '../fee/fee-category.enum';
import { FeeDataDto } from '../fee/fee-data.dto';
import { FeeStatus } from '../fee/fee-status.enum';

// eslint-disable-next-line @typescript-eslint/naming-convention
const PICKED_FIELDS = [
  'data',
  'platformFeePercentage',
  'offerRequestId',
] as const;

@InputType()
export class FeeCreationInput extends PickType(
  FeeDto,
  PICKED_FIELDS,
  InputType,
) {
  static adapter: FirebaseAdapter<Omit<FeeDB, 'userId'>, FeeCreationInput>;
}

FeeCreationInput.adapter = new FirebaseAdapter({
  toExternal: ({ data, offerRequest, platformFeePercentage }) => ({
    data: FeeDataDto.adapter.toExternal(data),
    offerRequestId: offerRequest,
    platformFeePercentage,
  }),
  toInternal: (external) => ({
    data: FeeDataDto.adapter.toInternal(external.data),
    platformFeePercentage: external.platformFeePercentage,
    offerRequest: external.offerRequestId,
    feeCategory: 'material' as FeeCategory,
    status: 'pending' as FeeStatus,
    customerVAT: FEE_CUSTOMER_VAT,
    serviceProviderVAT: FEE_SERVICE_PROVIDER_VAT,
    createdAt: Date.now(),
    amountPaid: undefined,
    stripePaymentIntentId: undefined,
  }),
});
