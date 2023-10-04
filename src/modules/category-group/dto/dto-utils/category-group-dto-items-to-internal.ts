import { CategoryGroupItem } from 'hero24-types';

import { CategoryGroupItemDto } from '../category-group-item';

import { TypeSafeRequired } from '$modules/common/common.types';

export const categoryGroupDtoItemsToInternal = (
  items: CategoryGroupItem[],
  item: CategoryGroupItemDto,
  index: number,
): TypeSafeRequired<CategoryGroupItem>[] => ({
  ...items,
  [index.toString()]: CategoryGroupItemDto.adapter.toInternal(item),
});
