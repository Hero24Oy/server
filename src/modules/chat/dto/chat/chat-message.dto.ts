import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChatMessageDB } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { LocationDto } from 'src/modules/common/dto/location/location.dto';

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

  static convertFromFirebaseType(
    chatMessage: ChatMessageDB,
    id: string,
  ): ChatMessageDto {
    return {
      id,
      chatId: chatMessage.data.initial.chat,
      content: chatMessage.data.initial.content,
      createdAt: new Date(chatMessage.data.initial.createdAt),
      imageCount: chatMessage.data.initial.imageCount,
      imageIds:
        chatMessage.data.initial.images &&
        Object.keys(chatMessage.data.initial.images),
      location: chatMessage.data.initial.location,
      senderId: chatMessage.data.initial.sender,
    };
  }
}
