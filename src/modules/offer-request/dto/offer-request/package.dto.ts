import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { PackageDB } from 'hero24-types';
import { MaybeType, TypeSafeRequired } from 'src/modules/common/common.types';

import { TranslationFieldDto } from 'src/modules/common/dto/translation-field.dto';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

type PackageShape = {
  id: string;
  name: TranslationFieldDto;
  description: TranslationFieldDto;
  order: number;
  pricePerHour: number;
  recommendedDuration?: MaybeType<number>;
  citiesIncluded?: MaybeType<string[]>;
  citiesExcluded?: MaybeType<string[]>;
};

@ObjectType()
export class PackageDto
  extends FirebaseGraphQLAdapter<PackageShape, PackageDB, { id: string }>
  implements PackageShape
{
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

  protected toFirebaseType(): TypeSafeRequired<PackageDB> {
    return {
      cities_excluded: this.citiesExcluded ?? undefined,
      cities_included: this.citiesIncluded ?? undefined,
      description: this.description,
      name: this.name,
      order: this.order,
      pricePerHour: this.pricePerHour,
      recommendedDuration: this.recommendedDuration ?? undefined,
    };
  }

  protected fromFirebaseType(
    firebase: PackageDB & { id: string },
  ): TypeSafeRequired<PackageShape> {
    return {
      citiesExcluded: firebase.cities_excluded,
      citiesIncluded: firebase.cities_included,
      description: firebase.description,
      id: firebase.id,
      name: firebase.name,
      order: firebase.order,
      pricePerHour: firebase.pricePerHour,
      recommendedDuration: firebase.recommendedDuration,
    };
  }
}
