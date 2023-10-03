import { CategoryGroupItemsDB } from 'hero24-types';

import { CategoryGroupItemDto } from '../category-group-item-dto';

export const categoryGroupDtoItemsToInternalReducer = (
  items: CategoryGroupItemsDB,
  item: CategoryGroupItemDto,
  index: number,
): CategoryGroupItemsDB =>
  ({
    ...items,
    [index.toString()]: CategoryGroupItemDto.adapter.toInternal(item),
  } as CategoryGroupItemsDB);
