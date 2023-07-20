import { Field, ObjectType } from "@nestjs/graphql";
import { TranslationFieldDto } from "../translation-field.dto";
import { MaybeType } from "../../common.types";

@ObjectType()
export class QuestionsDto {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto, { nullable: true })
  name: TranslationFieldDto;

  @Field(() => Boolean, { nullable: true })
  optional: MaybeType<boolean>;

  @Field(() => Number)
  order: number;

  @Field(() => String)
  type: string;

  @Field(() => Boolean, { nullable: true })
  showError: MaybeType<boolean>;

  @Field(() => Number, { nullable: true })
  position: MaybeType<number>;
}
