import isNumber from 'lodash/isNumber';

type HasNextPageArgs = {
  total: number;
  limit?: number;
  offset?: number;
};

export const hasNextPage = ({ limit, offset, total }: HasNextPageArgs) => {
  const hasPagination = isNumber(limit) && isNumber(offset);

  if (!hasPagination) {
    return false;
  }

  return offset + limit < total;
};
