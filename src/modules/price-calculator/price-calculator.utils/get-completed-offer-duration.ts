import isArray from 'lodash/isArray';
import { Duration } from 'moment';
import moment from 'moment-timezone';

import { getMoment } from './get-moment';

import { OfferDto } from '$modules/offer/dto/offer/offer.dto';

export const getCompletedOfferDuration = (offer: OfferDto): Duration => {
  if (!isArray(offer.data.workTime)) {
    throw new Error('Work time is undefined');
  }

  const workedTimeDuration = moment.duration(0, 'milliseconds');

  offer.data.workTime.forEach(({ startTime, endTime }) => {
    if (!endTime) {
      throw new Error('End time is not defined');
    }

    const startMoment = getMoment(startTime);
    const endMoment = getMoment(endTime);

    const deltaInMs = endMoment.diff(startMoment, 'milliseconds');

    workedTimeDuration.add(deltaInMs, 'milliseconds');
  });

  return workedTimeDuration;

  // TODO sort it out
  // if (offer.data.workTime?.length) {
  // }

  // if (offer.data.actualStartTime && offer.data.actualCompletedTime) {
  //   const startMoment = getMoment(offer.data.actualStartTime);
  //   const endMoment = getMoment(offer.data.actualCompletedTime);

  //   const duration = moment.duration(
  //     endMoment.diff(startMoment, 'milliseconds') -
  //       (offer.data.pauseDurationMS || 0),
  //     'milliseconds',
  //   );

  //   return duration;
  // }

  // return moment.duration(0, 'h');
};
