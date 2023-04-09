import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { SuitableTimeDto } from 'src/modules/common/dto/suitable-time/suitable-time.dto';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

@ObjectType()
export class OfferRequestDateQuestionDto extends OfferRequestBaseQuestionDto {
  @Field(() => String)
  type: 'date';

  @Field(() => Int, { nullable: true })
  preferredTime?: MaybeType<number>;

  @Field(() => Int, { nullable: true })
  suitableTimesCount?: MaybeType<number>;

  @Field(() => [SuitableTimeDto], { nullable: true })
  suitableTimes?: MaybeType<SuitableTimeDto[]>;
}
