import { CategoryGroups } from 'hero24-types';

import { CategoryGroupDto } from '../category-group';

export const categoryGroupsDtoToInternal = (
  res: CategoryGroups,
  category: CategoryGroupDto,
): CategoryGroups =>
  ({
    ...res,
    [category.id]: CategoryGroupDto.adapter.toInternal(category),
  } as CategoryGroups);
