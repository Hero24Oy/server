import { ArgsType, Field } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';
import { LocationInput } from '$modules/common/dto/location/location.input';

@ArgsType()
export class ChatMessageCreationArgs {
  @Field(() => String)
  content: string;

  @Field(() => String)
  chatId: string;

  @Field(() => [String], { nullable: true })
  imageIds: MaybeType<string[]>;

  @Field(() => LocationInput, { nullable: true })
  location: MaybeType<LocationInput>;
}
