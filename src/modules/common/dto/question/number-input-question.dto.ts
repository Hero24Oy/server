import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { BaseQuestionDto } from './base-question.dto';

@ObjectType()
export class NumberInputQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'number_input';

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => TranslationFieldDto, { nullable: true })
  extra_placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;
}
