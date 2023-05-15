import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

@ObjectType()
export class OfferRequestImageQuestionDto extends OfferRequestBaseQuestionDto {
  @Field(() => String)
  type: 'image';

  @Field(() => [String], { nullable: true })
  images?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;
}
