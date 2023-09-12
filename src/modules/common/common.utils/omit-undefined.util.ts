import { OmitValue } from '../common.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- we need any here
export const omitUndefined = <Type extends Record<string, any>>(
  record: Type,
): OmitValue<Type, undefined> => {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => typeof value !== 'undefined'),
  ) as OmitValue<Type, undefined>;
};
