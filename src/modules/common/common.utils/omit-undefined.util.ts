import { OmitValue } from '../common.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const omitUndefined = <T extends Record<string, any>>(
  record: T,
): OmitValue<T, undefined> => {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => typeof value !== 'undefined'),
  ) as OmitValue<T, undefined>;
};
