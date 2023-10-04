import { CategoryGroups } from 'hero24-types';

import { CategoryGroupDto } from './category-group';
import {
  categoryGroupsDtoToExternal,
  categoryGroupsDtoToInternal,
} from './dto-utils';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export class CategoryGroupsDto extends Array<CategoryGroupDto> {
  static adapter: FirebaseAdapter<CategoryGroups, CategoryGroupsDto>;
}

CategoryGroupsDto.adapter = new FirebaseAdapter({
  toExternal: (internal): CategoryGroupsDto =>
    Object.entries(internal).map(categoryGroupsDtoToExternal),
  toInternal: (external): CategoryGroups =>
    external.reduce(categoryGroupsDtoToInternal, {}),
});