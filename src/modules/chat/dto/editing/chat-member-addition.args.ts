import { ArgsType, Field } from '@nestjs/graphql';

import { ChatMemberRole } from '../chat/chat-member-role.enum';

@ArgsType()
export class ChatMemberAdditionArgs {
  @Field(() => String)
  chatId: string;

  @Field(() => String)
  userId: string;

  @Field(() => ChatMemberRole)
  role: ChatMemberRole;
}
