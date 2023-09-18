import isString from 'lodash/isString';

import { SortablePrimitives } from './sorter.types';

export const isLess = <Primitive extends SortablePrimitives>(
  left: Primitive,
  right: Primitive,
): boolean => {
  if (isString(left) && isString(right)) {
    return left.localeCompare(right) === -1;
  }

  return left < right;
};
