import { Field, ObjectType } from '@nestjs/graphql';
import { ChatMemberRole } from '../../chat.types';
import { MaybeType } from 'src/modules/common/common.types';

@ObjectType()
export class ChatMemberDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  role: ChatMemberRole;

  @Field(() => Date, { nullable: true })
  lastOpened?: MaybeType<Date>;
}
