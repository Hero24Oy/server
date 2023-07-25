import { isNumber } from 'lodash';

type HasNextPageArgs = {
  limit?: number;
  offset?: number;
  total: number;
};

export const hasNextPage = ({ limit, offset, total }: HasNextPageArgs) => {
  const hasPagination = isNumber(limit) && isNumber(offset);

  if (!hasPagination) {
    return false;
  }

  return offset + limit < total;
};
