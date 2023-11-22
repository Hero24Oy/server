import moment, { Moment } from 'moment-timezone';

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
