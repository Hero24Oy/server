import moment from 'moment';

import { MaybeType } from '$modules/common/common.types';

/**
 * 
  Returns 1970-01-01 if it's first fetch
 */
export const getScheduleFetchDate = (date: MaybeType<Date>): string => {
  return moment(date ?? new Date(0)).format('YYYY-MM-DD');
};
