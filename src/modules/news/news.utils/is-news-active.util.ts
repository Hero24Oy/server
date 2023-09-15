import moment from 'moment';

import { NewsDto } from '../dto/news/news.dto';

export const isNewsActive = (news: NewsDto) => {
  const isSameOrBeforeEnd = moment().add(-1, 'day').isSameOrBefore(news.endAt);

  const isSameOrAfterStart = moment().isSameOrAfter(news.startAt);

  return isSameOrAfterStart && isSameOrBeforeEnd; // [start, end]
};
