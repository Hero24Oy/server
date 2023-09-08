import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType('TranslationFieldDtoInput')
export class TranslationFieldDto {
  @Field(() => String)
  en: string;

  @Field(() => String)
  fi: string;
}
