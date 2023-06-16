import { Field, Int, Float, InputType } from '@nestjs/graphql';
import { PackageDB } from 'hero24-types';

import { omitUndefined } from 'src/modules/common/common.utils';
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

  @Field(() => Float)
  pricePerHour: number;

  @Field(() => Float, { nullable: true })
  recommendedDuration?: number;

  @Field(() => [String], { nullable: true })
  citiesIncluded?: string[];

  @Field(() => [String], { nullable: true })
  citiesExcluded?: string[];

  static convertToFirebaseType(data: PackageInput): PackageDB & { id: string } {
    return omitUndefined({
      ...data,
      cities_excluded: data.citiesExcluded,
      cities_included: data.citiesIncluded,
    });
  }
}
