import { Field, InputType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@InputType()
export class ChatsFilterInput {
  @Field(() => Boolean, { nullable: true })
  isAboutReclamation?: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  isAdminInvited?: MaybeType<boolean>;

  @Field(() => [String], { nullable: true })
  customerIds?: MaybeType<string[]>;

  @Field(() => [String], { nullable: true })
  sellerIds?: MaybeType<string[]>;

  @Field(() => String, { nullable: true })
  orderIdSearch?: MaybeType<string>;
}
