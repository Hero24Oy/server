import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';

@ObjectType()
export class BaseQuestionDto {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Boolean, { nullable: true })
  optional?: MaybeType<boolean>;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  type: string;

  @Field(() => Boolean, { nullable: true })
  showError?: MaybeType<boolean>;

  @Field(() => Number, { nullable: true })
  position?: MaybeType<number>;
}
