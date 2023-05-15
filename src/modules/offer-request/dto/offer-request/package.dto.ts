import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { PackageDB } from 'hero24-types';
import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';

@ObjectType()
export class PackageDto {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  @Field(() => TranslationFieldDto)
  description: TranslationFieldDto;

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

  static convertFromFirebaseType(data: PackageDB, id: string): PackageDto {
    return {
      ...data,
      id,
      citiesExcluded: data.cities_excluded,
      citiesIncluded: data.cities_included,
    };
  }

  static convertToFirebaseType(data: PackageDto): PackageDB {
    return {
      ...data,
      cities_excluded: data.citiesExcluded,
      cities_included: data.citiesIncluded,
    };
  }
}
