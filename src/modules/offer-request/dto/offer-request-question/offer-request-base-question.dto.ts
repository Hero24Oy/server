import { Field, InputType, Int, InterfaceType } from '@nestjs/graphql';
import { OfferRequestQuestion } from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

import { QUESTION_FLAT_ID_NAME } from '../../offer-request.constants';

type BaseOfferRequestQuestionDB<
  Type extends OfferRequestQuestion['type'] = OfferRequestQuestion['type'],
> = Pick<OfferRequestQuestion, 'id' | 'name' | 'order'> & {
  [QUESTION_FLAT_ID_NAME]?: string;
  type: Type;
};

@InterfaceType()
@InputType({ isAbstract: true })
export abstract class OfferRequestBaseQuestionDto<
  Type extends OfferRequestQuestion['type'] = OfferRequestQuestion['type'],
> {
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

  static adapter: FirebaseAdapter<
    BaseOfferRequestQuestionDB,
    OfferRequestBaseQuestionDto
  >;
}

OfferRequestBaseQuestionDto.adapter = new FirebaseAdapter({
  toInternal(external) {
    return {
      id: external.id,
      [QUESTION_FLAT_ID_NAME]: external[QUESTION_FLAT_ID_NAME],
      name: external.name || null,
      order: external.order,
      type: external.type,
    };
  },
  toExternal(internal) {
    return {
      id: internal.id,
      [QUESTION_FLAT_ID_NAME]: internal[QUESTION_FLAT_ID_NAME],
      name: internal.name,
      order: internal.order || 0,
      type: internal.type,
    };
  },
});
