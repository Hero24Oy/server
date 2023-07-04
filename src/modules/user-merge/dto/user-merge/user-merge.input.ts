import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class UserMergeInput {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  emailToSearch?: string;

  @Field(() => String, { nullable: true })
  emailStatus?: string;

  @Field(() => Boolean, { nullable: true })
  emailVerifiedByUser?: boolean;

  @Field(() => String, { nullable: true })
  phoneToSearch?: string;

  @Field(() => String, { nullable: true })
  phoneStatus?: string;

  @Field(() => Boolean, { nullable: true })
  phoneVerifiedByUser?: boolean;
}
