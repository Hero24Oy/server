import moment from 'moment';

export const getPreviousFetchDate = (days: number): Date => {
  return moment().subtract(days, 'days').toDate();
};
