import moment from 'moment';

import { MaybeType } from '$modules/common/common.types';

export const getScheduleFetchDate = (date: MaybeType<Date>): string => {
  return moment(date ?? new Date(0)).format('YYYY-MM-DD');
};
