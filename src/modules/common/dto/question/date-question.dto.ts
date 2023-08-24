import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { SuitableTimeDto } from 'src/modules/common/dto/suitable-time/suitable-time.dto';
import { BaseQuestionDto } from './base-question.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { PlainQuestion } from './question.types';

type QuestionType = 'date';

type PlainDateQuestion = Extract<
  PlainQuestion,
  { type: QuestionType }
>;

@ObjectType({ implements: () => BaseQuestionDto })
@InputType('DateQuestionInput')
export class DateQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'date';

  @Field(() => Date, { nullable: true })
  preferredTime?: MaybeType<Date>;

  @Field(() => Int, { nullable: true })
  suitableTimesCount?: MaybeType<number>;

  @Field(() => [SuitableTimeDto], { nullable: true })
  suitableTimes?: MaybeType<SuitableTimeDto[]>;

  static adapter: FirebaseAdapter<PlainDateQuestion, DateQuestionDto>;
}

DateQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    ...BaseQuestionDto.adapter.toInternal(external),
    depsId: external.depsId || undefined,
    type: 'date' as QuestionType,
    preferredTime: external.preferredTime ? +external.preferredTime : undefined,
    suitableTimesCount: external.suitableTimesCount || undefined,
    suitableTimes: external.suitableTimes
      ? SuitableTimeDto.convertToFirebaseTime(external.suitableTimes)
      : undefined,
  }),
  toExternal: (internal) => ({
    ...BaseQuestionDto.adapter.toExternal(internal),
    type: 'date' as QuestionType,
    preferredTime:
      typeof internal.preferredTime === 'number'
        ? new Date(internal.preferredTime)
        : null,
    suitableTimesCount: internal.suitableTimesCount,
    suitableTimes: internal.suitableTimes
      ? SuitableTimeDto.convertFromFirebaseTime(internal.suitableTimes)
      : null,
  }),
});
