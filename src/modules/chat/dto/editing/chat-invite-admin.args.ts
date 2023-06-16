import { ArgsType, Field } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';

@ArgsType()
export class ChatInviteAdminArgs {
  @Field(() => String)
  chatId: string;

  @Field(() => Boolean, { nullable: true })
  isAboutReclamation: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isReasonGiven: MaybeType<boolean>;
}
