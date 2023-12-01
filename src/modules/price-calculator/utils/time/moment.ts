import { CategoryDB } from 'hero24-types';
import moment, {
  Duration,
  duration,
  isDate,
  isMoment,
  Moment,
} from 'moment-timezone';

import { OfferRequestDto } from '$modules/offer-request/dto/offer-request/offer-request.dto';

export const getDurationInH = (durationInMs: number): Duration =>
  duration(durationInMs, 'h');

export const getMinimumOfferDuration = (
  offerRequest: OfferRequestDto,
  category: CategoryDB,
): Duration => {
  const minimumDuration =
    offerRequest.minimumDuration ?? category.minimumDuration;

  return getDurationInH(minimumDuration);
};

export const getMoment = (date: string | number | Date | Moment): Moment => {
  if (isMoment(date)) {
    return date;
  }

  if (isDate(date)) {
    return moment(date).tz('Europe/Helsinki');
  }

  if (Number.isInteger(Number(date))) {
    return moment(date, 'x').tz('Europe/Helsinki');
  }

  return moment(date).tz('Europe/Helsinki');
};
