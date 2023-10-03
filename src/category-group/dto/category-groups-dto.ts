import { CategoryGroupsDB } from 'hero24-types';

import {
  categoryGroupsDtoToExternal,
  categoryGroupsDtoToInternal,
} from './category-group.utils';
import { CategoryGroupDto } from './category-group-dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export class CategoryGroupsDto extends Array<CategoryGroupDto> {
  static adapter: FirebaseAdapter<CategoryGroupsDB, CategoryGroupsDto>;
}

CategoryGroupsDto.adapter = new FirebaseAdapter({
  toExternal: (internal): CategoryGroupsDto =>
    Object.entries(internal).map(categoryGroupsDtoToExternal),
  toInternal: (external): CategoryGroupsDB =>
    external.reduce(categoryGroupsDtoToInternal, {}),
});
