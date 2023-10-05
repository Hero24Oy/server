import moment from 'moment';

import { scheduleFetchDays } from '../constants';

import { getPreviousFetchDate } from './get-previous-fetch-date';

export const getScheduleFetchDate = (): string | null => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const scheduleFetchDay = scheduleFetchDays.find(
    ({ day }) => day === dayOfWeek,
  );

  if (!scheduleFetchDay) {
    return null;
  }

  const previousDate = getPreviousFetchDate(scheduleFetchDay.transform);

  return moment(previousDate).format('YYYY-MM-DD');
};
