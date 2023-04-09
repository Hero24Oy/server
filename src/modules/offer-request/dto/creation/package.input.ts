import { Field, Int, InputType } from '@nestjs/graphql';
import { PackageDB } from 'hero24-types';
import { TranslationFieldInput } from 'src/modules/common/dto/translation-field.input';

@InputType()
export class PackageInput {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldInput)
  name: TranslationFieldInput;

  @Field(() => TranslationFieldInput)
  description: TranslationFieldInput;

  @Field(() => Int)
  order: number;

  @Field(() => Int)
  pricePerHour: number;

  @Field(() => Int, { nullable: true })
  recommendedDuration?: number;

  @Field(() => [String], { nullable: true })
  citiesIncluded?: string[];

  @Field(() => [String])
  citiesExcluded?: string[];

  static convertToFirebaseType(data: PackageInput): PackageDB & { id: string } {
    return {
      ...data,
      cities_excluded: data.citiesExcluded,
      cities_included: data.citiesIncluded,
    };
  }
}
