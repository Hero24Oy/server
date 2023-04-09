import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TranslationFieldInput {
  @Field(() => String)
  en: string;

  @Field(() => String)
  fi: string;
}
