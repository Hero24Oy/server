import { Field, InputType } from '@nestjs/graphql';
import MergeStatus from './merge-status.dto';

@InputType()
export class UserMergeInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  emailToSearch: string;

  @Field(() => MergeStatus)
  emailStatus: MergeStatus;

  @Field(() => Boolean, { nullable: true })
  emailVerifiedByUser?: boolean;

  @Field(() => String)
  phoneToSearch: string;

  @Field(() => MergeStatus)
  phoneStatus: MergeStatus;

  @Field(() => Boolean, { nullable: true })
  phoneVerifiedByUser?: boolean;
}
