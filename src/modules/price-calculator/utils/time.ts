import { duration } from 'moment-timezone';

export const getDurationInH = (durationInMs: number): number =>
  duration(durationInMs, 'h').asHours();
