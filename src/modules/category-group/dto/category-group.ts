import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CategoryGroup } from 'hero24-types';

import { CategoryGroupItemDto } from './category-group-item';

import { TypeSafeRequired } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export interface CategoryGroupWithId extends CategoryGroup {
  id: string;
}

@ObjectType()
export class CategoryGroupDto {
  @Field(() => String)
  id: string;

  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  @Field(() => Int)
  order: number;

  @Field(() => [CategoryGroupItemDto])
  items: CategoryGroupItemDto[];

  static adapter: FirebaseAdapter<CategoryGroupWithId, CategoryGroupDto>;
}

CategoryGroupDto.adapter = new FirebaseAdapter({
  toExternal: (internal): TypeSafeRequired<CategoryGroupDto> => ({
    id: internal.id,
    name: internal.name,
    order: internal.order,
    items: internal.items.map(CategoryGroupItemDto.adapter.toExternal),
  }),
  toInternal: (external): TypeSafeRequired<CategoryGroupWithId> => ({
    id: external.id,
    name: external.name,
    order: external.order,
    items: external.items.map(CategoryGroupItemDto.adapter.toInternal),
  }),
});
