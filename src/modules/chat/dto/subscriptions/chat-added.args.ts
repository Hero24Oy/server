import { ArgsType, Field } from '@nestjs/graphql';

import { IS_FROM_APP_DEPRECATED_MESSAGE } from '../../chat.constants';

@ArgsType()
export class ChatAddedArgs {
  @Field(() => Boolean, {
    nullable: true,
    deprecationReason: IS_FROM_APP_DEPRECATED_MESSAGE,
  })
  isFromApp?: boolean;
}
