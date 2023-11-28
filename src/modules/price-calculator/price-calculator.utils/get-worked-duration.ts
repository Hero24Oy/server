import isFinite from 'lodash/isFinite';
import round from 'lodash/round';
import moment from 'moment';

export const getWorkedDuration = (
  workedDuration: moment.Duration,
  minimumDuration: moment.Duration,
  purchasedDuration: moment.Duration,
): number => {
  let resultDuration: moment.Duration = workedDuration.clone();

  // * Invoice only for purchased duration, not for worked one
  if (resultDuration.asHours() > purchasedDuration.asHours()) {
    resultDuration = purchasedDuration.clone();
  }

  // * charge minimum if not reached
  if (resultDuration.asHours() < minimumDuration.asHours()) {
    resultDuration = minimumDuration.clone();
  }

  return roundOfferDuration(resultDuration).asHours();
};

type TimePrecision = [number, moment.unitOfTime.Base];
// eslint-disable-next-line no-magic-numbers -- 0.5 is precision for hours counting
const timePrecision: TimePrecision = [0.5, 'hours'];

const roundOfferDuration = (duration: moment.Duration): moment.Duration => {
  const roundedTime = roundBy(
    duration.asMilliseconds(),
    moment.duration(...timePrecision).asMilliseconds(),
    'ceil',
  );

  return moment.duration(roundedTime, 'milliseconds');
};

type RoundType = 'ceil' | 'floor' | 'round';

const roundBy = (
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
