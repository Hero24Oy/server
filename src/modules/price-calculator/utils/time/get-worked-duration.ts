import moment, { Duration } from 'moment';

import { roundToStep } from '../calculations/round-to-step';

export type GetWorkedDurationParams = {
  minimumDuration: Duration;
  purchasedDuration: Duration;
  workedDuration: Duration;
};

export const getWorkedDurationInH = (
  params: GetWorkedDurationParams,
): number => {
  const { minimumDuration, purchasedDuration, workedDuration } = params;

  let resultDuration: moment.Duration = workedDuration.clone();

  // * Invoice only for purchased duration, not for worked one
  if (resultDuration.asHours() > purchasedDuration.asHours()) {
    resultDuration = purchasedDuration.clone();
  }

  // * charge minimum if not reached
  if (resultDuration.asHours() < minimumDuration.asHours()) {
    resultDuration = minimumDuration.clone();
  }

  const roundedDurationInMs = roundedOfferDurationInH(
    resultDuration.asMilliseconds(),
  );

  return roundedDurationInMs;
};

type TimePrecision = [number, moment.unitOfTime.Base];
// eslint-disable-next-line no-magic-numbers -- 0.5h is rounding step
const timePrecision: TimePrecision = [0.5, 'hours'];
const ROUNDING_STEP_IN_MS = moment.duration(...timePrecision).asMilliseconds();

/**
 *
 * @returns {number} duration rounded to step 0.5 (0.5, 1, 1.5)
 */
export const roundedOfferDurationInH = (durationInMs: number): number =>
  moment
    .duration(
      roundToStep(durationInMs, ROUNDING_STEP_IN_MS, 'ceil'),
      'milliseconds',
    )
    .asHours();
