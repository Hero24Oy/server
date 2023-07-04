import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import {
  BaseOfferRequestQuestionDB,
  BaseOfferRequestQuestionShape,
  OfferRequestBaseQuestionDto,
} from './offer-request-base-question.dto';
import { PlainOfferRequestQuestion } from '../../offer-request-questions.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';

type QuestionType = 'image';

type OfferRequestImageQuestionAdapterShape =
  BaseOfferRequestQuestionShape<QuestionType> & {
    images?: MaybeType<string[]>;
    imageCount?: MaybeType<number>;
  };

type PlainOfferRequestBaseQuestion = PlainOfferRequestQuestion & {
  type: QuestionType;
};

export type OfferRequestImageQuestionInputShape =
  OfferRequestImageQuestionAdapterShape;

@ObjectType({ implements: () => OfferRequestBaseQuestionDto })
@InputType('OfferRequestImageQuestionInput')
export class OfferRequestImageQuestionDto extends OfferRequestBaseQuestionDto<
  QuestionType,
  OfferRequestImageQuestionAdapterShape,
  PlainOfferRequestBaseQuestion
> {
  @Field(() => [String], { nullable: true })
  images?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;

  protected toFirebaseType(): TypeSafeRequired<
    PlainOfferRequestBaseQuestion & BaseOfferRequestQuestionDB<QuestionType>
  > {
    return {
      ...this.toBaseFirebaseType(),
      images: this.images ? convertListToFirebaseMap(this.images) : null,
      imageCount: this.imageCount || 0,
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestBaseQuestion,
  ): TypeSafeRequired<OfferRequestImageQuestionAdapterShape> {
    return {
      ...this.fromBaseFirebaseType(firebase),
      images: firebase.images && convertFirebaseMapToList(firebase.images),
      imageCount: firebase.imageCount,
    };
  }
}
