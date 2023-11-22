import isFinite from 'lodash/isFinite';

export const getPrecision = (value: number): number => {
  if (!isFinite(value)) {
    return 0;
  }

  let step = 1;
  let precision = 0;

  while (Math.round(value * step) / step !== value) {
    // eslint-disable-next-line no-magic-numbers -- multiplying by 10 adds precision every time until conditions met
    step *= 10;
    precision++;
  }

  return precision;
};
