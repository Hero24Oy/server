import { CategoryGroupItemsDB } from 'hero24-types';

import { CategoryGroupDataItemDto } from '../category-group-data-item-dto';

export const categoryGroupDataDtoToInternalReducer = (
  items: CategoryGroupItemsDB,
  item: CategoryGroupDataItemDto,
  index: number,
): CategoryGroupItemsDB =>
  ({
    ...items,
    [index.toString()]: CategoryGroupDataItemDto.adapter.toInternal(item),
  } as CategoryGroupItemsDB);
