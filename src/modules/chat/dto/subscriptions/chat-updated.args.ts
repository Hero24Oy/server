import { ArgsType, Field } from '@nestjs/graphql';

import { IS_FROM_APP_DEPRECATED_MESSAGE } from '../../chat.constants';

import { MaybeType } from '$/modules/common/common.types';

@ArgsType()
export class ChatUpdatedArgs {
  @Field(() => [String], { nullable: true })
  chatIds: MaybeType<string[]>;

  @Field(() => Boolean, {
    nullable: true,
    deprecationReason: IS_FROM_APP_DEPRECATED_MESSAGE,
  })
  isFromApp?: MaybeType<boolean>;
}
