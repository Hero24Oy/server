import { WorkTime } from 'hero24-types';

import { OfferDataDto } from '../dto/offer/offer-data.dto';

import {
  DeeplyNonNullable,
  MaybeType,
} from '$/src/modules/common/common.types';

export type UpdatedDateDB = {
  isPaused: boolean;
  workTime: WorkTime[];
  pauseDurationMS?: MaybeType<number>;
};

export type UpdatedDateGraphql = DeeplyNonNullable<
  Pick<OfferDataDto, 'isPaused' | 'workTime' | 'pauseDurationMS'>
>;
