import { OmitValue } from '../common.types';

export const omitUndefined = <T extends Record<string, any>>(
  record: T,
): OmitValue<T, undefined> => {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => typeof value !== 'undefined'),
  ) as OmitValue<T, undefined>;
};
