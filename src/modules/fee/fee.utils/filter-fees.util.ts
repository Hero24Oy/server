import { MaybeType } from '../../common/common.types';
import { FeeDto } from '../dto/fee/fee.dto';
import { FeeListFilterInput } from '../dto/fee-list/fee-list-filter.input';

import { isString } from '$imports/lodash';

type Props = {
  fees: FeeDto[];
  filter?: MaybeType<FeeListFilterInput>;
};

export const filterFees = (props: Props): FeeDto[] => {
  const { fees: allFees, filter } = props;

  if (!filter) {
    return allFees;
  }

  const { status, offerRequestId, buyerId } = filter;

  let fees = allFees;

  if (isString(status)) {
    fees = fees.filter((fee) => fee.status === status);
  }

  if (isString(offerRequestId)) {
    fees = fees.filter((fee) => fee.offerRequestId === offerRequestId);
  }

  if (isString(buyerId)) {
    fees = fees.filter((fee) => fee.userId === buyerId);
  }

  return fees;
};
