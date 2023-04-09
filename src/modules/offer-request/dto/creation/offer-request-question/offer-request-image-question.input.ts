import { Field, Int, InputType } from '@nestjs/graphql';
import { OfferRequestImageQuestion } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import {
  convertListToFirebaseMap,
  executeIfDefined,
  omitUndefined,
} from 'src/modules/common/common.utils';
import { OfferRequestBaseQuestionInput } from './offer-request-base-question.input';

@InputType()
export class OfferRequestImageQuestionInput extends OfferRequestBaseQuestionInput {
  @Field(() => String)
  type: 'image';

  @Field(() => [Int], { nullable: true })
  images?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;

  static convertToFirebaseType(
    question: OfferRequestImageQuestionInput,
  ): OfferRequestImageQuestion {
    return omitUndefined({
      ...OfferRequestBaseQuestionInput.convertBaseToFirebaseType(question),
      images: executeIfDefined(question.images, convertListToFirebaseMap, null),
      imageCount: executeIfDefined(question.imageCount, (count) => count, null),
    });
  }
}
