import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryGroupItem } from 'hero24-types';

import { TypeSafeRequired } from '$modules/common/common.types';
import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class CategoryGroupItemDto {
  @Field(() => String)
  categoryId: string;

  @Field(() => String)
  imageName: string;

  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  static adapter: FirebaseAdapter<CategoryGroupItem, CategoryGroupItemDto>;
}

CategoryGroupItemDto.adapter = new FirebaseAdapter({
  toExternal: (internal): TypeSafeRequired<CategoryGroupItemDto> => ({
    categoryId: internal.categoryId,
    imageName: internal.imageName,
    name: internal.name,
  }),
  toInternal: (external): TypeSafeRequired<CategoryGroupItem> => ({
    categoryId: external.categoryId,
    imageName: external.imageName,
    name: external.name,
  }),
});
