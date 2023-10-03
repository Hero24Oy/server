import moment from 'moment';

export const formatDateForNetvisor = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD');
};
