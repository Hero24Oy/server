import { Field, ObjectType } from '@nestjs/graphql';
import { WorkTime } from 'hero24-types';

import { isNumber } from '$imports/lodash';
import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class WorkTimeDto {
  @Field(() => Date)
  startTime: Date;

  @Field(() => Date, { nullable: true })
  endTime?: MaybeType<Date>;

  static adapter: FirebaseAdapter<WorkTime, WorkTimeDto>;
}

WorkTimeDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    startTime: new Date(internal.startTime),
    endTime: isNumber(internal.endTime) ? new Date(internal.endTime) : null,
  }),
  toInternal: (external) => ({
    startTime: Number(external.startTime),
    endTime: external.endTime ? Number(external.endTime) : undefined,
  }),
});
