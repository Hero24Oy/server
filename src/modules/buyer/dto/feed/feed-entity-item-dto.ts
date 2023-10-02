import { Field, ObjectType } from '@nestjs/graphql';
import { FeedDBGroupItem } from 'hero24-types';

import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class FeedEntityItemDto {
  @Field(() => String)
  categoryId: string;

  @Field(() => String)
  imageName: string;

  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  static adapter: FirebaseAdapter<FeedDBGroupItem, FeedEntityItemDto>;
}

FeedEntityItemDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    categoryId: internal.categoryId,
    imageName: internal.imageName,
    name: internal.name,
  }),
  toInternal: (external) => ({
    categoryId: external.categoryId,
    imageName: external.imageName,
    name: external.name,
  }),
});
