import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { SuitableTimeDto } from 'src/modules/common/dto/suitable-time/suitable-time.dto';
import { BaseQuestionDto } from './base-question.dto';

@ObjectType()
export class DateQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'date';

  @Field(() => Date, { nullable: true })
  preferredTime?: MaybeType<Date>;

  @Field(() => Int, { nullable: true })
  suitableTimesCount?: MaybeType<number>;

  @Field(() => [SuitableTimeDto], { nullable: true })
  suitableTimes?: MaybeType<SuitableTimeDto[]>;
}
