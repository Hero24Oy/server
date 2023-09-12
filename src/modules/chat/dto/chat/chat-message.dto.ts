import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChatMessageDB } from 'hero24-types';

import { MaybeType } from '$/src/modules/common/common.types';
import { convertListToFirebaseMap } from '$/src/modules/common/common.utils';
import { LocationDto } from '$/src/modules/common/dto/location/location.dto';
import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

@ObjectType()
export class ChatMessageDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  chatId: string;

  @Field(() => String)
  content: string;

  @Field(() => String)
  senderId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => [String], { nullable: true })
  imageIds?: MaybeType<string[]>;

  @Field(() => Int, { nullable: true })
  imageCount?: MaybeType<number>;

  @Field(() => LocationDto, { nullable: true })
  location?: MaybeType<LocationDto>;

  static adapter: FirebaseAdapter<
    ChatMessageDB & { id: string },
    ChatMessageDto
  >;
}

ChatMessageDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    chatId: internal.data.initial.chat,
    content: internal.data.initial.content,
    createdAt: new Date(internal.data.initial.createdAt),
    imageCount: internal.data.initial.imageCount,
    imageIds:
      internal.data.initial.images && Object.keys(internal.data.initial.images),
    location: internal.data.initial.location,
    senderId: internal.data.initial.sender,
  }),
  toInternal: (external) => ({
    id: external.id,
    data: {
      initial: {
        chat: external.chatId,
        content: external.content,
        createdAt: Number(external.createdAt),
        imageCount: external.imageCount ?? undefined,
        images: external.imageIds
          ? convertListToFirebaseMap(external.imageIds)
          : undefined,
        location: external.location ?? undefined,
        sender: external.senderId,
      },
    },
  }),
});
