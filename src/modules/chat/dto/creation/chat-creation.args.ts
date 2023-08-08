import { ArgsType, Field } from '@nestjs/graphql';
import { ChatMemberRole } from '../chat/chat-member-role.enum';

@ArgsType()
export class ChatCreationArgs {
  @Field(() => String)
  offerRequestId: string;

  @Field(() => ChatMemberRole)
  role: ChatMemberRole;
}
