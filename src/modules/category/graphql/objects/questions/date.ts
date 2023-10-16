import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { BaseQuestionObject } from './base';

import { QuestionType } from '$modules/category/enums';
import { PlainQuestion } from '$modules/category/types';
import { MaybeType } from '$modules/common/common.types';
import { SuitableTimeDto } from '$modules/common/dto/suitable-time/suitable-time.dto';

type LocalPlainQuestion = PlainQuestion & {
  type: `${QuestionType.DATE}`;
};

@ObjectType({ implements: () => BaseQuestionObject })
export class DateQuestionObject extends BaseQuestionObject {
  @Field(() => String)
  declare type: QuestionType;

  @Field(() => Date, { nullable: true })
  preferredTime?: MaybeType<Date>;

  @Field(() => Int, { nullable: true })
  suitableTimesCount?: MaybeType<number>;

  @Field(() => [SuitableTimeDto], { nullable: true })
  suitableTimes?: MaybeType<SuitableTimeDto[]>;

  declare static adapter: FirebaseAdapter<
    LocalPlainQuestion,
    DateQuestionObject
  >;
}

DateQuestionObject.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    depsId: external.depsId ?? undefined,
    ...BaseQuestionObject.adapter.toInternal(external),
    type: QuestionType.DATE as QuestionType.DATE,
    preferredTime: external.preferredTime
      ? Number(external.preferredTime)
      : undefined,
    suitableTimesCount: external.suitableTimesCount ?? undefined,
    suitableTimes: external.suitableTimes
      ? SuitableTimeDto.convertToFirebaseTime(external.suitableTimes)
      : undefined,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionObject.adapter.toExternal(internal),
    type: QuestionType.DATE as QuestionType.DATE,
    preferredTime: internal.preferredTime
      ? new Date(internal.preferredTime)
      : null,
    suitableTimesCount: internal.suitableTimesCount,
    suitableTimes: internal.suitableTimes
      ? SuitableTimeDto.convertFromFirebaseTime(internal.suitableTimes)
      : null,
  }),
});
