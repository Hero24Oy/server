import { Field, InputType } from '@nestjs/graphql';

import { ChatMemberRole } from '../chat/chat-member-role.enum';

@InputType()
export class ChatCreationInput {
  @Field(() => String)
  offerRequestId: string;

  @Field(() => ChatMemberRole)
  role: ChatMemberRole;
}
