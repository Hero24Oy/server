import { FeeDto } from '../dto/fee/fee.dto';
import { FeeListFilterInput } from '../dto/fee-list/fee-list-filter.input';
import {
  FEE_CREATED_SUBSCRIPTION,
  FEE_UPDATED_SUBSCRIPTION,
} from '../fee.constants';

type FeeSubscriptionType =
  | typeof FEE_CREATED_SUBSCRIPTION
  | typeof FEE_UPDATED_SUBSCRIPTION;

type Payload = Record<FeeSubscriptionType, FeeDto>;

export const FeeSubscriptionFilter =
  (type: FeeSubscriptionType) =>
  (payload: Payload, { filter }: { filter: FeeListFilterInput }) => {
    const fee = payload[type];
    const { buyerId, offerRequestId, status } = filter;

    if (buyerId && buyerId !== fee.userId) {
      return false;
    }

    if (offerRequestId && offerRequestId !== fee.offerRequestId) {
      return false;
    }

    if (status && status !== fee.status) {
      return false;
    }

    return true;
  };
