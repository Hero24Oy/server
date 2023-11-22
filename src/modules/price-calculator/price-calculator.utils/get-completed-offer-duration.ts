import moment from 'moment-timezone';

import { getMoment } from './get-moment';

import { OfferDto } from '$modules/offer/dto/offer/offer.dto';

export const getCompletedOfferDuration = (offer: OfferDto): moment.Duration => {
  if (offer.data.workTime?.length) {
    return offer.data.workTime.reduce((acc, { startTime, endTime }) => {
      if (endTime) {
        const startMoment = getMoment(startTime);
        const endMoment = getMoment(endTime);

        return acc.add(
          endMoment.diff(startMoment, 'milliseconds'),
          'milliseconds',
        );
      }

      return acc;
    }, moment.duration(0, 'milliseconds'));
  }

  if (offer.data.actualStartTime && offer.data.actualCompletedTime) {
    const startMoment = getMoment(offer.data.actualStartTime);
    const endMoment = getMoment(offer.data.actualCompletedTime);

    const duration = moment.duration(
      endMoment.diff(startMoment, 'milliseconds') -
        (offer.data.pauseDurationMS || 0),
      'milliseconds',
    );

    return duration;
  }

  return moment.duration(0, 'h');
};
