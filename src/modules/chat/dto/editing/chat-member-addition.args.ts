import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ChatMemberAdditionArgs {
  @Field(() => String)
  chatId: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  role: 'admin' | 'seller' | 'buyer';
}
