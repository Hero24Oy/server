import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { ChatMessageDto } from './chat-message.dto';
import { ChatMemberDto } from './chat-member.dto';
import { ChatDB } from 'hero24-types';
import { ChatMemberRole } from '../../chat.types';

@ObjectType()
export class ChatDto {
  @Field(() => String)
  id: string;

  // The following type is needed for the field resolver
  messageIds: string[];
  // The following type is optional because the messages is handled by field resolver
  @Field(() => [ChatMessageDto])
  messages?: ChatMessageDto[];

  @Field(() => [ChatMemberDto])
  members: ChatMemberDto[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  offerId?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  offerRequestId?: MaybeType<string>;

  @Field(() => Boolean, { nullable: true })
  inviteAdmin?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isAboutReclamation?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  seenByAdmin?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  reasonGiven?: MaybeType<boolean>;

  static convertFromFirebaseType(chat: ChatDB, id: string): ChatDto {
    return {
      id,
      createdAt: new Date(chat.data.initial.createdAt),
      inviteAdmin: chat.data.inviteAdmin,
      isAboutReclamation: chat.data.isAboutReclamation,
      offerId: chat.data.initial.offer,
      offerRequestId: chat.data.initial.offerRequest,
      reasonGiven: chat.data.reasonGiven,
      seenByAdmin: chat.data.seenByAdmin,
      messageIds: Object.keys(chat.data.messages || {}),
      members: Object.entries(chat.data.members).map(([id, member]) => ({
        id,
        role: member.role as ChatMemberRole,
        lastOpened: member.lastOpened ? new Date(member.lastOpened) : null,
      })),
    };
  }
}
