import { CategoryGroupsDB } from 'hero24-types';

import { CategoryGroupDto } from './category-group-dto';
import { categoryGroupsDtoToExternal } from './category-groups.utils/category-groups-dto-to-external-util';
import { categoryGroupsDtoToInternal } from './category-groups.utils/category-groups-dto-to-internal-util';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export class CategoryGroupsDto extends Array<CategoryGroupDto> {
  static adapter: FirebaseAdapter<CategoryGroupsDB, CategoryGroupsDto>;
}

CategoryGroupsDto.adapter = new FirebaseAdapter({
  toExternal: (internal): CategoryGroupsDto =>
    Object.entries(internal).map(categoryGroupsDtoToExternal),
  toInternal: (external): CategoryGroupsDB =>
    external.reduce(categoryGroupsDtoToInternal, {} as CategoryGroupsDB),
});
