import { FeedDB } from 'hero24-types';

import { FeedItemDto } from './feed-item-dto';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export class FeedDto extends Array<FeedItemDto> {
  static adapter: FirebaseAdapter<FeedDB, FeedDto>;
}

FeedDto.adapter = new FirebaseAdapter({
  toExternal: (internal) =>
    Object.entries(internal).map(([id, feed]) =>
      FeedItemDto.adapter.toExternal({
        id,
        ...feed,
      }),
    ),
  toInternal: (external) => {
    return external.reduce((res, feed) => {
      return { ...res, ...{ [feed.id]: FeedItemDto.adapter.toInternal(feed) } };
    }, {} as FeedDB);
  },
});
