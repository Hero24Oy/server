import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';

@ObjectType()
export class CategoryMainAddressDto {
  @Field(() => Boolean, { nullable: true })
  main: MaybeType<boolean>;
}

@ObjectType()
export class CategoryDeliveryAddressDto {
  @Field(() => Boolean, { nullable: true })
  from: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  to: MaybeType<boolean>;
}

export const CategoryAddressesDto = createUnionType({
  name: 'CategoryAddressesDto',
  types: () => [CategoryMainAddressDto, CategoryDeliveryAddressDto] as const,
});

export type CategoryAddressesDto = typeof CategoryAddressesDto;