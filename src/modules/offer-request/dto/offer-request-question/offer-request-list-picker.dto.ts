import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { OfferRequestBaseQuestionDto } from './offer-request-base-question.dto';

@ObjectType()
export class OfferRequestListPickerDto extends OfferRequestBaseQuestionDto {
  @Field(() => String)
  type: 'list';

  @Field(() => TranslationFieldDto, { nullable: true })
  placeholder?: MaybeType<TranslationFieldDto>;

  @Field(() => Int, { nullable: true })
  numericValue?: MaybeType<number>;
}
