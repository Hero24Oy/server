import { FORMAT_MAX_LENGTH } from '../netvisor.constants';

export const formatDateForNetvisor = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(FORMAT_MAX_LENGTH, '0');
  const day = String(date.getDate()).padStart(FORMAT_MAX_LENGTH, '0');

  return `${year}-${month}-${day}`;
};
