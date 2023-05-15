import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ChatMessageCreationArgs {
  @Field(() => String)
  content: string;

  @Field(() => String)
  chatId: string;
}
