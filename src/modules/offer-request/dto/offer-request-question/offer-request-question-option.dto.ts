import { Field, Int, ObjectType } from '@nestjs/graphql';

import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { PlainOfferRequestQuestionOption } from '../../offer-request-questions.types';

type OfferRequestQuestionOptionShape = {
  id: string;
  name?: MaybeType<TranslationFieldDto>;
  order?: MaybeType<number>;
  questions?: MaybeType<string[]>; // it will be used to tackle circular deps in graphql. This is custom ID, generated on the go.
  checked?: MaybeType<boolean>;
};

@ObjectType()
export class OfferRequestQuestionOptionDto extends FirebaseGraphQLAdapter<
  OfferRequestQuestionOptionShape,
  PlainOfferRequestQuestionOption
> {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Int, { nullable: true })
  order?: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  questions?: MaybeType<string[]>; // it will be used to tackle circular deps in graphql. This is custom ID, generated on the go.

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
  ): TypeSafeRequired<OfferRequestQuestionOptionShape> {
    return {
      id: firebase.id,
      checked: firebase.checked,
      name: firebase.name,
      order: firebase.order,
      questions: firebase.questions,
    };
  }
}
