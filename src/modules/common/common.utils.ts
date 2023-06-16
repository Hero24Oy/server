import { OmitValue } from './common.types';

export const timestampToDate = (timestamp: number) => new Date(timestamp);

export const executeIfDefined = <T, R, D>(
  value: T | undefined,
  fn: (value: T) => R,
  defaultValue: D,
): R | D => {
  if (value === undefined) {
    return defaultValue;
  }

  return fn(value);
};

export const omitUndefined = <T extends Record<string, any>>(
  record: T,
): OmitValue<T, undefined> => {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => typeof value !== 'undefined'),
  ) as OmitValue<T, undefined>;
};

export const convertListToFirebaseMap = (list: string[]) =>
  Object.fromEntries(list.map((item) => [item, true] as const));

export const convertFirebaseMapToList = (
  firebaseMap: Record<string, boolean>,
) => Object.keys(firebaseMap);

export const callRepeatedlyAsync = async (
  handler: () => Promise<unknown>,
  condition: (error: Error) => boolean,
  step: number,
) => {
  try {
    return await handler();
  } catch (error) {
    if (condition(error) && step > 1) {
      return callRepeatedlyAsync(handler, condition, step - 1);
    }

    throw error;
  }
};

export const isNotNull = <T>(value: T | null): value is Exclude<T, null> =>
  value !== null;
