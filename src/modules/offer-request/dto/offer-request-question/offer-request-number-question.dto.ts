import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

@ObjectType()
export class OfferRequestNumberQuestionDto extends OfferRequestBaseQuestionDto {
  @Field(() => String)
  type: 'number';

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Int, { nullable: true })
  numericValue?: MaybeType<number>;
}
