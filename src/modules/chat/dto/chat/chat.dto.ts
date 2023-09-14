import { Field, ObjectType } from '@nestjs/graphql';
import { ChatDB } from 'hero24-types';
import { isNumber, max } from 'lodash';
import { MaybeType } from 'src/modules/common/common.types';
import { convertListToFirebaseMap } from 'src/modules/common/common.utils';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

import { ChatMemberDto } from './chat-member.dto';

@ObjectType()
export class ChatDto {
  @Field(() => String)
  id: string;

  // The following type is needed for the field resolver
  messageIds: string[];

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

  @Field(() => Date, { nullable: true })
  lastMessageDate?: MaybeType<Date>;

  static adapter: FirebaseAdapter<
    ChatDB & { id: string },
    Omit<ChatDto, 'messages'>
  >;
}

ChatDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => {
    const lastMessageDate = max(
      Object.values(internal.data.members)
        .map((member) => member.lastMessageDate)
        .filter(isNumber),
    );

    return {
      id: internal.id,
      createdAt: new Date(internal.data.initial.createdAt),
      inviteAdmin: internal.data.inviteAdmin,
      isAboutReclamation: internal.data.isAboutReclamation,
      offerId: internal.data.initial.offer,
      offerRequestId: internal.data.initial.offerRequest,
      reasonGiven: internal.data.reasonGiven,
      seenByAdmin: internal.data.seenByAdmin,
      messageIds: Object.keys(internal.data.messages || {}),
      members: Object.entries(internal.data.members).map(([id, member]) =>
        ChatMemberDto.adapter.toExternal({ ...member, id }),
      ),
      lastMessageDate: lastMessageDate ? new Date(lastMessageDate) : null,
    };
  },
  toInternal: (external) => ({
    id: external.id,
    data: {
      initial: {
        createdAt: +external.createdAt,
        offer: external.offerId ?? undefined,
        offerRequest: external.offerRequestId ?? undefined,
      },
      inviteAdmin: external.inviteAdmin ?? undefined,
      isAboutReclamation: external.isAboutReclamation ?? undefined,
      reasonGiven: external.reasonGiven ?? undefined,
      seenByAdmin: external.seenByAdmin ?? undefined,
      messages: convertListToFirebaseMap(external.messageIds),
      members: Object.fromEntries(
        external.members
          .map(ChatMemberDto.adapter.toInternal)
          .map(({ id, ...member }) => [id, member]),
      ),
    },
  }),
});
