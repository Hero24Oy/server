import { CategoryDB } from 'hero24-types';
import moment, { Moment } from 'moment-timezone';

import { OfferRequestDto } from '$modules/offer-request/dto/offer-request/offer-request.dto';

export const getDurationInH = (durationInMs: number) =>
  moment.duration(durationInMs, 'h');

export const getMinimumOfferDuration = (
  offerRequest: OfferRequestDto,
  category: CategoryDB,
): moment.Duration => {
  const minimumDuration =
    offerRequest.minimumDuration ?? category.minimumDuration;

  return getDurationInH(minimumDuration);
};

export const getMoment = (date: string | number | Date | Moment): Moment => {
  if (moment.isMoment(date)) {
    return date;
  }

  if (moment.isDate(date)) {
    return moment(date).tz('Europe/Helsinki');
  }

  if (Number.isInteger(Number(date))) {
    // timestamp
    return moment(date, 'x').tz('Europe/Helsinki'); // timestamp
  }

  return moment(date).tz('Europe/Helsinki');
};
