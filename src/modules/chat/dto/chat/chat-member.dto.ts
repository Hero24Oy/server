import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

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

  static adapter: FirebaseAdapter<
    ChatMemberDB & { id: string },
    Omit<ChatMemberDto, 'avatar' | 'buyerName' | 'sellerName' | 'userName'>
  >;
}

ChatMemberDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    id: internal.id,
    lastOpened: internal.lastOpened ? new Date(internal.lastOpened) : null,
    role: internal.role as ChatMemberRole,
    lastMessageDate: internal.lastMessageDate
      ? new Date(internal.lastMessageDate)
      : null,
  }),
  toInternal: (external) => ({
    id: external.id,
    lastOpened: external.lastOpened ? Number(external.lastOpened) : undefined,
    role: external.role,
    lastMessageDate: external.lastMessageDate
      ? Number(external.lastMessageDate)
      : null,
  }),
});
