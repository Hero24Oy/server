import { CategoryGroup } from 'hero24-types';

import { CategoryGroupDto } from '../category-group';

import { TypeSafeRequired } from '$modules/common/common.types';

type FeedDtoToExternalMapperProps = [string, CategoryGroup];

export const categoryGroupsDtoToExternal = (
  input: FeedDtoToExternalMapperProps,
): TypeSafeRequired<CategoryGroupDto> => {
  const [id, feed] = input;

  return CategoryGroupDto.adapter.toExternal({
    id,
    ...feed,
  });
};
