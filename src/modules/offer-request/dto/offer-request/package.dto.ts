import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { PackageDB } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';

import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

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
  recommendedDuration?: MaybeType<number>;

  @Field(() => [String], { nullable: true })
  citiesIncluded?: MaybeType<string[]>;

  @Field(() => [String], { nullable: true })
  citiesExcluded?: MaybeType<string[]>;

  static adapter: FirebaseAdapter<PackageDB & { id: string }, PackageDto>;
}

PackageDto.adapter = new FirebaseAdapter({
  toInternal(external) {
    return {
      id: external.id,
      cities_excluded: external.citiesExcluded ?? undefined,
      cities_included: external.citiesIncluded ?? undefined,
      description: external.description,
      name: external.name,
      order: external.order,
      pricePerHour: external.pricePerHour,
      recommendedDuration: external.recommendedDuration ?? undefined,
    };
  },

  toExternal(internal) {
    return {
      citiesExcluded: internal.cities_excluded,
      citiesIncluded: internal.cities_included,
      description: internal.description,
      id: internal.id,
      name: internal.name,
      order: internal.order,
      pricePerHour: internal.pricePerHour,
      recommendedDuration: internal.recommendedDuration,
    };
  },
});
