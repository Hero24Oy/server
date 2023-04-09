import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

@ObjectType()
export class OfferRequestNumberInputQuestionDto extends OfferRequestBaseQuestionDto {
  @Field(() => String)
  type: 'number_input';

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => TranslationFieldDto, { nullable: true })
  extra_placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => String, { nullable: true })
  value?: MaybeType<string>;
}
