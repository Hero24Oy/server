import round from 'lodash/round';

import { getPrecision } from './get-precision';

type RoundType = 'ceil' | 'floor' | 'round';

export const roundBy = (
  value: number,
  step: number,
  roundType: RoundType = 'round',
): number => {
  if (step <= 0) {
    throw new Error('step must be > 0');
  }

  const remainder = value % step;
  const precision = getPrecision(step);

  if (roundType === 'ceil') {
    return remainder ? round(value - remainder + step, precision) : value;
  }

  if (roundType === 'floor') {
    return remainder ? round(value - remainder, precision) : value;
  }

  // eslint-disable-next-line no-magic-numbers -- TODO don't know what it is, figure it out
  if (remainder > step / 2) {
    return round(value - remainder + step, precision);
  }

  return round(value - remainder, precision);
};
