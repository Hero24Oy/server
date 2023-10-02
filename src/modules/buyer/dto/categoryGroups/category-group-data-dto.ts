import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CategoryGroupDB,
  CategoryGroupItemDB,
  CategoryGroupItemsDB,
} from 'hero24-types';

import { CategoryGroupDataItemDto } from './category-group-data-item-dto';
import categoryGroupDataDtoToInternalReducer from './categoryGroups.utils/categoryGroupDataDtoToInternalReducer';

import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class CategoryGroupDataDto {
  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  @Field(() => Int)
  order: number;

  @Field(() => [CategoryGroupDataItemDto])
  items: CategoryGroupDataItemDto[];

  static adapter: FirebaseAdapter<CategoryGroupDB, CategoryGroupDataDto>;
}

CategoryGroupDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    name: internal.name,
    order: internal.order,
    items: Object.values(internal.items as CategoryGroupItemDB[]).map((item) =>
      CategoryGroupDataItemDto.adapter.toExternal(item),
    ),
  }),
  toInternal: (external) => ({
    name: external.name,
    order: external.order,
    items: Object.values(external.items).reduce(
      categoryGroupDataDtoToInternalReducer,
      {} as CategoryGroupItemsDB,
    ),
  }),
});
