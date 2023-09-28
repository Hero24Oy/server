import { Field, ObjectType } from '@nestjs/graphql';
import { FeedDB } from 'hero24-types';

import { FeedEntityDto } from './feed-entity-dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class FeedItemDto {
  @Field(() => String)
  id: string;

  @Field(() => FeedEntityDto)
  data: FeedEntityDto;

  static adapter: FirebaseAdapter<
    FeedDB['groupId'] & { id: string },
    FeedItemDto
  >;
}

FeedItemDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    data: FeedEntityDto.adapter.toExternal({
      name: internal.name,
      order: internal.order,
      items: internal.items,
    }),
  }),
  toInternal: (external) => ({
    id: external.id,
    ...FeedEntityDto.adapter.toInternal(external.data),
  }),
});
