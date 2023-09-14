import moment from 'moment';

import { roundToStep } from '$modules/price-calculator/price-calculator.utils/round-to-step.util';

const DURATION_HOURS_PRECISION = 0.5;

export const roundDuration = (duration: moment.Duration): moment.Duration => {
  const hours = duration.asHours();

  const roundedHours = roundToStep(hours, DURATION_HOURS_PRECISION, 'ceil');

  return moment.duration(roundedHours, 'hours');
};
