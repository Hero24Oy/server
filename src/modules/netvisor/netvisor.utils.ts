import {
  FORMAT_MAX_LENGTH,
  FRIDAY,
  FROM_FRIDAY_TO_TUESDAY,
  FROM_TUESDAY_TO_FRIDAY,
  TUESDAY,
} from './netvisor.constants';

export const getTuesdayOrFridayDate = (): string | null => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  if (dayOfWeek === FRIDAY) {
    const lastTuesday = new Date(today);

    lastTuesday.setDate(today.getDate() - FROM_FRIDAY_TO_TUESDAY);

    return formatDateForNetvisor(lastTuesday);
  }

  if (dayOfWeek === TUESDAY) {
    const lastFriday = new Date(today);

    lastFriday.setDate(today.getDate() - FROM_TUESDAY_TO_FRIDAY);

    return formatDateForNetvisor(lastFriday);
  }

  return null;
};

const formatDateForNetvisor = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(FORMAT_MAX_LENGTH, '0');
  const day = String(date.getDate()).padStart(FORMAT_MAX_LENGTH, '0');

  return `${year}-${month}-${day}`;
};
