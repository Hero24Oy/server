import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DictionaryDto {
  @Field(() => [String], { nullable: true })
  en: string[] | null;

  @Field(() => [String], { nullable: true })
  fi: string[] | null;
}
