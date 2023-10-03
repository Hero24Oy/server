import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryGroupDB } from 'hero24-types';

import { CategoryGroupDataDto } from './category-group-data-dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export interface CategoryGroupDbWithId extends CategoryGroupDB {
  id: string;
}

@ObjectType()
export class CategoryGroupDto {
  @Field(() => String)
  id: string;

  @Field(() => CategoryGroupDataDto)
  data: CategoryGroupDataDto;

  static adapter: FirebaseAdapter<CategoryGroupDbWithId, CategoryGroupDto>;
}

CategoryGroupDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    data: CategoryGroupDataDto.adapter.toExternal({
      name: internal.name,
      order: internal.order,
      items: internal.items,
    }),
  }),
  toInternal: (external) => ({
    id: external.id,
    ...CategoryGroupDataDto.adapter.toInternal(external.data),
  }),
});
