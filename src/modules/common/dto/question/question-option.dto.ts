import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Label,
  QuestionDB,
  QuestionOptionDB,
  QuestionsDB,
} from 'hero24-types';

import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { omitUndefined } from 'src/modules/common/common.utils';
import { convertListToObjects } from '../../common.utils/convert-list-to-objects.util';

import { QuestionDto, QuestionDtoConvertor } from './question.dto';

@ObjectType()
export class QuestionOptionDto {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Int, { nullable: true })
  order?: MaybeType<number>;

  @Field(() => [QuestionDto], { nullable: true })
  questions?: MaybeType<QuestionDto[]>;

  @Field(() => Boolean, { nullable: true })
  checked?: MaybeType<boolean>;

  static convertToFirebaseType(data: QuestionOptionDto): QuestionOptionDB {
    return omitUndefined({
      ...data,
      name: data.name ? (data.name as Label) : undefined,
      order: data.order ? data.order : undefined,
      questions: data.questions
        ? convertListToObjects(data.questions)
        : undefined,
      checked: data.checked ? data.checked : undefined,
    });
  }

  static convertFromFirebaseType(
    data: QuestionOptionDB,
    id: string,
  ): QuestionOptionDto {
    const questions: QuestionDto[] = [];

    for (const id in data.questions) {
      const question: QuestionDB = questions[id];
      questions.push(
        QuestionDtoConvertor.convertFromFirebaseType(question, id),
      );
    }

    return {
      ...data,
      id,
      questions: data.questions ? questions : undefined,
    };
  }
}
