import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { PackageDB } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
@InputType('PackageInput')
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
  toInternal: (external) => ({
    id: external.id,
    cities_excluded: external.citiesExcluded ?? undefined,
    cities_included: external.citiesIncluded ?? undefined,
    description: external.description,
    name: external.name,
    order: external.order,
    pricePerHour: external.pricePerHour,
    recommendedDuration: external.recommendedDuration ?? undefined,
  }),
  toExternal: (internal) => ({
    citiesExcluded: internal.cities_excluded,
    citiesIncluded: internal.cities_included,
    description: internal.description,
    id: internal.id,
    name: internal.name,
    order: internal.order,
    pricePerHour: internal.pricePerHour,
    recommendedDuration: internal.recommendedDuration,
  }),
});
