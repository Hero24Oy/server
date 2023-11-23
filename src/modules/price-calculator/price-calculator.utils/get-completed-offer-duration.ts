import { Duration } from 'moment';
import moment from 'moment-timezone';

import { getMoment } from './get-moment';

import { OfferDto } from '$modules/offer/dto/offer/offer.dto';

export const getCompletedOfferDuration = (offer: OfferDto): Duration => {
  const workedTimeDuration = moment.duration(0, 'milliseconds');

  if (offer.data.workTime) {
    offer.data.workTime.forEach(({ startTime, endTime }) => {
      if (!endTime) {
        throw new Error('End time is not defined');
      }

      const startMoment = getMoment(startTime);
      const endMoment = getMoment(endTime);

      const deltaInMs = endMoment.diff(startMoment, 'milliseconds');

      workedTimeDuration.add(deltaInMs, 'milliseconds');
    });
  } else if (offer.data.actualStartTime && offer.data.actualCompletedTime) {
    const startMoment = getMoment(offer.data.actualStartTime);
    const endMoment = getMoment(offer.data.actualCompletedTime);

    const duration = moment.duration(
      endMoment.diff(startMoment, 'milliseconds') -
        (offer.data.pauseDurationMS || 0),
      'milliseconds',
    );

    workedTimeDuration.add(duration);
  } else {
    throw new Error('Data required for calculation does not exist');
  }

  return workedTimeDuration;
};
