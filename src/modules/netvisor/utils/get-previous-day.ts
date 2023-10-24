import moment from 'moment';

export const getPreviousDay = (): string =>
  moment().subtract(1, 'day').format('YYYY-MM-DD');
