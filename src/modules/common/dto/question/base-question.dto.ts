import {
  Field,
  InputType,
  Int,
  InterfaceType,
  ObjectType,
} from '@nestjs/graphql';
import { BaseQuestionDB } from 'hero24-types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';
import { QUESTION_FLAT_ID_NAME } from './question.constants';

@InterfaceType()
@InputType({ isAbstract: true })
export class BaseQuestionDto {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  [QUESTION_FLAT_ID_NAME]?: string; // undefined for the root question

  @Field(() => TranslationFieldDto)
  name?: TranslationFieldDto;

  @Field(() => Boolean)
  optional?: boolean;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  type: string;

  @Field(() => Boolean)
  showError?: boolean;

  @Field(() => Number)
  position?: number;

  static adapter: FirebaseAdapter<BaseQuestionDB, BaseQuestionDto>;
}

BaseQuestionDto.adapter = new FirebaseAdapter({
  toInternal: (external) => {
    return {
      ...external,
      [QUESTION_FLAT_ID_NAME]: external[QUESTION_FLAT_ID_NAME],
    };
  },
  toExternal: (internal) => {
    return {
      ...internal,
      [QUESTION_FLAT_ID_NAME]: internal[QUESTION_FLAT_ID_NAME],
    };
  },
});
