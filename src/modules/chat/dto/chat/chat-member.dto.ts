import { Field, ObjectType } from '@nestjs/graphql';
import { ChatDB } from 'hero24-types';

import { ChatMemberRole } from './chat-member-role.enum';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export type ChatMemberDB = ChatDB['data']['members'][string];

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
