import moment from 'moment';

import { roundBy } from './round-by';

// TODO tests
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
// TODO move to module config
// eslint-disable-next-line no-magic-numbers -- 0.5 is precision for hours counting
const timePrecision: TimePrecision = [0.5, 'hours'];

export const roundOfferDuration = (
  duration: moment.Duration,
): moment.Duration => {
  const roundedTime = roundBy(
    duration.asMilliseconds(),
    moment.duration(...timePrecision).asMilliseconds(),
    'ceil',
  );

  return moment.duration(roundedTime, 'milliseconds');
};
