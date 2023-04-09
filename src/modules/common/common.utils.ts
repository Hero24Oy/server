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
