import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { BaseQuestionDto } from './base-question.dto';

@ObjectType()
export class TextAreaQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'textarea';

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;
}
