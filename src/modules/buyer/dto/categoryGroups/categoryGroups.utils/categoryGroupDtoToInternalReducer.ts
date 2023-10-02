import { CategoryGroupsDB } from 'hero24-types';

import { CategoryGroupDto } from '../category-group-dto';

const categoryGroupDtoToInternalReducer = (
  res: CategoryGroupsDB,
  category: CategoryGroupDto,
): CategoryGroupsDB =>
  ({
    ...res,
    ...{ [category.id]: CategoryGroupDto.adapter.toInternal(category) },
  } as CategoryGroupsDB);

export default categoryGroupDtoToInternalReducer;
