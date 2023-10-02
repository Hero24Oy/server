import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FeedDBGroup } from 'hero24-types';

import { FeedEntityItemDto } from './feed-entity-item-dto';

import { TranslationFieldDto } from '$modules/common/dto/translation-field.dto';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class FeedEntityDto {
  @Field(() => [FeedEntityItemDto])
  items: FeedEntityItemDto[];

  @Field(() => TranslationFieldDto)
  name: TranslationFieldDto;

  @Field(() => Int)
  order: number;

  static adapter: FirebaseAdapter<FeedDBGroup, FeedEntityDto>;
}

FeedEntityDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    name: internal.name,
    order: internal.order,
    items: Object.values(internal.items).map((item) =>
      FeedEntityItemDto.adapter.toExternal(item),
    ),
  }),
  toInternal: (external) => ({
    name: external.name,
    order: external.order,
    items: Object.values(external.items).reduce((items, item, index) => {
      Object.assign(items, {
        [index.toString()]: FeedEntityItemDto.adapter.toInternal(item),
      });

      return items;
    }, {} as FeedDBGroup['items']),
  }),
});
