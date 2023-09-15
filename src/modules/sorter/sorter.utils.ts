import { SortablePrimitives } from './sorter.types';

import { isString } from '$imports/lodash';

export const isLess = <Primitive extends SortablePrimitives>(
  left: Primitive,
  right: Primitive,
): boolean => {
  if (isString(left) && isString(right)) {
    return left.localeCompare(right) === -1;
  }

  return left < right;
};
