import { CategoryGroupsDB } from 'hero24-types';

import { CategoryGroupDto } from './category-group-dto';
import { categoryGroupsDtoToExternalMapper } from './category-groups.utils/categoryGroupsDtoToExternalMapper';
import { categoryGroupsDtoToInternalReducer } from './category-groups.utils/categoryGroupsDtoToInternalReducer';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export class CategoryGroupsDto extends Array<CategoryGroupDto> {
  static adapter: FirebaseAdapter<CategoryGroupsDB, CategoryGroupsDto>;
}

CategoryGroupsDto.adapter = new FirebaseAdapter({
  toExternal: (internal): CategoryGroupsDto =>
    Object.entries(internal).map(categoryGroupsDtoToExternalMapper),
  toInternal: (external): CategoryGroupsDB =>
    external.reduce(categoryGroupsDtoToInternalReducer, {} as CategoryGroupsDB),
});
