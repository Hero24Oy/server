import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';

@ObjectType()
export class OfferRequestBaseQuestionDto {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  depsId?: string; // undefined for the root question

  @Field(() => TranslationFieldDto, { nullable: true })
  name?: MaybeType<TranslationFieldDto>;

  @Field(() => Int)
  order: number;

  @Field(() => String)
  type: string;
}
