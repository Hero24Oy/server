import { CategoryGroupItem } from 'hero24-types';

import { CategoryGroupItemDto } from '../category-group-item';

export const categoryGroupDtoItemsToInternal = (
  items: CategoryGroupItem[],
  item: CategoryGroupItemDto,
  index: number,
): CategoryGroupItem[] =>
  ({
    ...items,
    [index.toString()]: CategoryGroupItemDto.adapter.toInternal(item),
  } as CategoryGroupItem[]);
