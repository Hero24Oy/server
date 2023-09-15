import precision from 'precision';

import { RoundedNumber } from '../price-calculator.monad';

import { ceil, floor, round } from '$imports/lodash';

const MAX_PRECISION = 12;
const mathFunctions = { ceil, floor, round };

type RoundDirection = 'ceil' | 'round' | 'floor';

export const roundToStep = (
  numberValue: number,
  numberStep: number,
  roundDirection: RoundDirection,
) => {
  const roundFunction = mathFunctions[roundDirection];
  const value = new RoundedNumber(numberValue, MAX_PRECISION);
  const step = new RoundedNumber(numberStep, MAX_PRECISION);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- this js lib without .d.ts
  const stepPrecision = step.run(precision);
  const stepCount = value.divide(step).run(roundFunction);

  return stepCount.multiply(step).toPrecision(stepPrecision).val();
};
