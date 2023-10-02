import { CategoryGroupsDB } from 'hero24-types';

import { CategoryGroupDto } from './category-group-dto';
import categoryGroupDtoToExternalMapper from './categoryGroups.utils/categoryGroupDtoToExternalMapper';
import categoryGroupDtoToInternalReducer from './categoryGroups.utils/categoryGroupDtoToInternalReducer';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export class CategoryGroupsDto extends Array<CategoryGroupDto> {
  static adapter: FirebaseAdapter<CategoryGroupsDB, CategoryGroupsDto>;
}

CategoryGroupsDto.adapter = new FirebaseAdapter({
  toExternal: (internal) =>
    Object.entries(internal).map(categoryGroupDtoToExternalMapper),
  toInternal: (external) =>
    external.reduce(categoryGroupDtoToInternalReducer, {} as CategoryGroupsDB),
});
