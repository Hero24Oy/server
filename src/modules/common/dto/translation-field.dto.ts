import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TranslationFieldDto {
  @Field(() => String)
  en: string;

  @Field(() => String)
  fi: string;
}
