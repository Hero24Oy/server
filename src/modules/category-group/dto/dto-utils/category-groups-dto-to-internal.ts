import { CategoryGroups } from 'hero24-types';

import { CategoryGroupDto } from '../category-group';

import { TypeSafeRequired } from '$modules/common/common.types';

export const categoryGroupsDtoToInternal = (
  res: CategoryGroups,
  category: CategoryGroupDto,
): TypeSafeRequired<CategoryGroups> => ({
  ...res,
  [category.id]: CategoryGroupDto.adapter.toInternal(category),
});
