import { Field, Int, Float, InputType } from '@nestjs/graphql';
import { PackageDB } from 'hero24-types';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';

import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

export type PackageShape = {
  id: string;
  name: TranslationFieldDto;
  description: TranslationFieldDto;
  order: number;
  pricePerHour: number;
  recommendedDuration?: MaybeType<number>;
  citiesIncluded?: MaybeType<string[]>;
  citiesExcluded?: MaybeType<string[]>;
};

@InputType()
export class PackageInput extends FirebaseGraphQLAdapter<
  PackageShape,
  PackageDB & { id: string }
> {
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

  protected toFirebaseType(): TypeSafeRequired<PackageDB & { id: string }> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      order: this.order,
      pricePerHour: this.pricePerHour,
      recommendedDuration: this.recommendedDuration ?? undefined,
      cities_included: this.citiesIncluded ?? undefined,
      cities_excluded: this.citiesExcluded ?? undefined,
    };
  }

  protected fromFirebaseType(
    firebase: PackageDB & { id: string },
  ): TypeSafeRequired<PackageShape> {
    return {
      id: firebase.id,
      name: firebase.name,
      description: firebase.description,
      order: firebase.order,
      pricePerHour: firebase.pricePerHour,
      recommendedDuration: firebase.recommendedDuration,
      citiesIncluded: firebase.cities_included,
      citiesExcluded: firebase.cities_excluded,
    };
  }
}
