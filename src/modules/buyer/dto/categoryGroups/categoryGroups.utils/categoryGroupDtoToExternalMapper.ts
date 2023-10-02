import { CategoryGroupDB } from 'hero24-types';

import { CategoryGroupDbWithId, CategoryGroupDto } from '../category-group-dto';

type FeedDtoToExternalMapperProps = [string, CategoryGroupDB];

const categoriesDtoToExternalMapper = (
  input: FeedDtoToExternalMapperProps,
): CategoryGroupDto => {
  const [id, feed] = input;

  return CategoryGroupDto.adapter.toExternal({
    id,
    ...feed,
  } as CategoryGroupDbWithId);
};

export default categoriesDtoToExternalMapper;
