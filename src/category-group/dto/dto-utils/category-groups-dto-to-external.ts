import { CategoryGroup } from 'hero24-types';

import { CategoryGroupDto, CategoryGroupWithId } from '../category-group';

type FeedDtoToExternalMapperProps = [string, CategoryGroup];

export const categoryGroupsDtoToExternal = (
  input: FeedDtoToExternalMapperProps,
): CategoryGroupDto => {
  const [id, feed] = input;

  return CategoryGroupDto.adapter.toExternal({
    id,
    ...feed,
  } as CategoryGroupWithId);
};
