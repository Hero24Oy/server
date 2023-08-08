import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';

import { ChatMemberDB } from '../../chat.types';
import { ChatMemberRole } from './chat-member-role.enum';

@ObjectType()
export class ChatMemberDto {
  @Field(() => String)
  id: string;

  @Field(() => ChatMemberRole)
  role: ChatMemberRole;

  @Field(() => Date, { nullable: true })
  lastOpened?: MaybeType<Date>;

  @Field(() => Date, { nullable: true })
  lastMessageDate?: MaybeType<Date>;

  @Field(() => String, { nullable: true })
  userName?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  avatar?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  buyerName?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  sellerName?: MaybeType<string>;

  static convertFromFirebaseType(
    chatMember: ChatMemberDB,
    id: string,
  ): ChatMemberDto {
    return {
      id,
      lastOpened: chatMember.lastOpened
        ? new Date(chatMember.lastOpened)
        : null,
      role: chatMember.role as ChatMemberRole,
      lastMessageDate: chatMember.lastMessageDate
        ? new Date(chatMember.lastMessageDate)
        : null,
    };
  }
}
