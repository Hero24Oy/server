import { Field, InputType, Int, InterfaceType } from '@nestjs/graphql';
import { OfferRequestQuestion } from 'hero24-types';
import {
  MaybeType,
  RecordType,
  TypeSafeRequired,
} from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { QUESTION_FLAT_ID_NAME } from '../../offer-request.constants';

export type BaseOfferRequestQuestionShape<
  Type extends OfferRequestQuestion['type'],
> = {
  id: string;
  [QUESTION_FLAT_ID_NAME]?: string; // undefined for the root question
  name?: MaybeType<TranslationFieldDto>;
  order: number;
  type: Type;
};

export type BaseOfferRequestQuestionDB<
  Type extends OfferRequestQuestion['type'],
> = Pick<OfferRequestQuestion, 'id' | 'name' | 'order'> & {
  [QUESTION_FLAT_ID_NAME]?: string;
  type: Type;
};

@InterfaceType()
@InputType({ isAbstract: true })
export abstract class OfferRequestBaseQuestionDto<
    Type extends OfferRequestQuestion['type'],
    Shape extends RecordType,
    FirebaseT extends RecordType,
    // eslint-disable-next-line @typescript-eslint/ban-types
    ExpandT extends RecordType = {},
  >
  extends FirebaseGraphQLAdapter<
    Shape & BaseOfferRequestQuestionShape<Type>,
    FirebaseT & BaseOfferRequestQuestionDB<Type>,
    ExpandT
  >
  implements BaseOfferRequestQuestionShape<Type>
{
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  [QUESTION_FLAT_ID_NAME]?: string; // undefined for the root question

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  type: Type;

  protected toBaseFirebaseType(): TypeSafeRequired<
    BaseOfferRequestQuestionDB<Type>
  > {
    return {
      id: this.id,
      [QUESTION_FLAT_ID_NAME]: this[QUESTION_FLAT_ID_NAME],
      name: this.name || null,
      order: this.order,
      type: this.type,
    };
  }

  protected fromBaseFirebaseType(
    firebase: BaseOfferRequestQuestionDB<Type>,
  ): TypeSafeRequired<BaseOfferRequestQuestionShape<Type>> {
    return {
      id: firebase.id,
      [QUESTION_FLAT_ID_NAME]: firebase[QUESTION_FLAT_ID_NAME],
      name: firebase.name,
      order: firebase.order || 0,
      type: firebase.type,
    };
  }
}
