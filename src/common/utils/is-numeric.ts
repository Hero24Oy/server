import { MaybeType } from '$modules/common/common.types';

export const isNumeric = (value?: MaybeType<string>): boolean => {
  if (!value) {
    return false;
  }

  return !Number.isNaN(value) && !Number.isNaN(parseFloat(value));
};
