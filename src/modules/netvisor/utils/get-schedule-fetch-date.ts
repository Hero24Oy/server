import moment from 'moment';

export const getScheduleFetchDate = (): string => {
  return moment().subtract(1, 'day').format('YYYY-MM-DD');
};
