export const convertToDecimalNumber = (value: number): number => {
  // eslint-disable-next-line no-magic-numbers -- TODO check rounding, if it can be deleted and other existing util used
  return Number(Number(value).toFixed(2));
};
