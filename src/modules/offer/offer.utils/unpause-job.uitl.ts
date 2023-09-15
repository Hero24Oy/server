import moment from 'moment';

import { OfferDto } from '../dto/offer/offer.dto';
import { WorkTimeDto } from '../dto/offer/work-time.dto';

type ReturnType = {
  pauseDurationMS: number;
  workTime: WorkTimeDto;
};

export const unpauseJob = (offer: OfferDto): ReturnType => {
  if (!offer.data.workTime) {
    throw new Error('Work time is undefined');
  }

  const lastWorkedTime =
    offer.data.workTime[offer.data.workTime.length - 1].endTime;

  const startPauseTime = moment(lastWorkedTime);
  const endPauseTime = moment();
  const pauseDuration = endPauseTime.diff(startPauseTime, 'milliseconds');

  const generalPauseDurationMS = offer.data.pauseDurationMS
    ? pauseDuration + offer.data.pauseDurationMS
    : pauseDuration;

  const workTime: WorkTimeDto = {
    startTime: new Date(),
  };

  return {
    pauseDurationMS: generalPauseDurationMS,
    workTime,
  };
};
