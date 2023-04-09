import { Field, Int, InputType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';

@InputType()
export class OfferRequestImageQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'image';

  @Field(() => [Int], { nullable: true })
  images?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;
}
