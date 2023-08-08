import { WorkTime } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';

export type UpdatedDateDB = {
  isPaused: boolean;
  workTime: WorkTime[];
  pauseDurationMS?: MaybeType<number>;
};
