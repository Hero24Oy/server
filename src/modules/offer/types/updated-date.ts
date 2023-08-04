import { WorkTime } from 'hero24-types';

export type UpdatedDateDB = {
  isPaused: boolean;
  workTime: WorkTime[];
  pauseDurationMS?: number;
};
