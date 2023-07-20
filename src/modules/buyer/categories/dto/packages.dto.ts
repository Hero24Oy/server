import { Field, ObjectType } from "@nestjs/graphql";
import { MaybeType } from "src/modules/common/common.types";
import { TranslationFieldDto } from "src/modules/common/dto/translation-field.dto";

@ObjectType()
export class PackagesDto {
  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  @Field(() => TranslationFieldDto)
  description: TranslationFieldDto;

  @Field(() => Number)
  order: number;

  @Field(() => Number)
  pricePerHour: number;

  @Field(() => Number, { nullable: true })
  recommendedDuration: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  cities_included: MaybeType<string[]>;

  @Field(() => [String], { nullable: true })
  cities_excluded: MaybeType<string[]>;
}
