import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { PlainOfferRequestQuestionOption } from '../../offer-request-questions.types';

type OfferRequestQuestionOptionAdapterShape = {
  id: string;
  name?: MaybeType<TranslationFieldDto>;
  order?: MaybeType<number>;
  questions?: MaybeType<string[]>;
  checked?: MaybeType<boolean>;
};

export type OfferRequestQuestionOptionInputShape =
  OfferRequestQuestionOptionAdapterShape;

@ObjectType()
@InputType('OfferRequestQuestionOptionInput')
export class OfferRequestQuestionOptionDto
  extends FirebaseGraphQLAdapter<
    OfferRequestQuestionOptionAdapterShape,
    PlainOfferRequestQuestionOption
  >
  implements OfferRequestQuestionOptionAdapterShape
{
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Int, { nullable: true })
  order?: MaybeType<number>;

  // it will be used to tackle circular deps in graphql. This is custom ID, generated on the go.
  @Field(() => [String], { nullable: true })
  questions?: MaybeType<string[]>;

  @Field(() => Boolean, { nullable: true })
  checked?: MaybeType<boolean>;

  protected toFirebaseType(): TypeSafeRequired<PlainOfferRequestQuestionOption> {
    return {
      id: this.id,
      name: this.name || null,
      order: typeof this.order === 'number' ? this.order : null,
      questions: this.questions || null,
      checked: this.checked ?? null,
    };
  }

  protected fromFirebaseType(
    firebase: PlainOfferRequestQuestionOption,
  ): TypeSafeRequired<OfferRequestQuestionOptionAdapterShape> {
    return {
      id: firebase.id,
      checked: firebase.checked,
      name: firebase.name,
      order: firebase.order,
      questions: firebase.questions,
    };
  }
}
