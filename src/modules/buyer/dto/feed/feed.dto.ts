import { Field, ObjectType } from '@nestjs/graphql';
import { FeedDB } from 'hero24-types';

import { FeedItemDto } from './feed-item-dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class FeedDto {
  @Field(() => [FeedItemDto])
  feeds: FeedItemDto[];

  static adapter: FirebaseAdapter<FeedDB, FeedDto>;
}

FeedDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    feeds: Object.entries(internal).map(([id, feed]) =>
      FeedItemDto.adapter.toExternal({
        id,
        ...feed,
      }),
    ),
  }),
  toInternal: (external) => {
    return external.feeds.reduce((res, feed) => {
      return { ...res, ...{ [feed.id]: FeedItemDto.adapter.toInternal(feed) } };
    }, {} as FeedDB);
  },
});
