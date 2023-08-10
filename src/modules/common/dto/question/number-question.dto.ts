import { Field, Float, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { BaseQuestionDto } from './base-question.dto';

@ObjectType()
export class NumberQuestionDto extends BaseQuestionDto {
  @Field(() => String)
  type: 'number';

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Float, { nullable: true })
  defaultValue?: MaybeType<number>;
}
