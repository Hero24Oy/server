import { scheduleFetchDays } from '../netvisor.constants';

import { formatDateForNetvisor } from './format-date-for-netvisor.util';

export const getScheduleFetchDate = (): string | null => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const scheduleFetchDay = scheduleFetchDays.find(
    ({ day: now }) => now === dayOfWeek,
  );

  if (!scheduleFetchDay) {
    return null;
  }

  const lastDate = new Date(today.getDate() - scheduleFetchDay.transform);

  return formatDateForNetvisor(lastDate);
};
