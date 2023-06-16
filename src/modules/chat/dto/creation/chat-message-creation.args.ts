import { ArgsType, Field } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';
import { LocationInput } from 'src/modules/common/dto/location/location.input';

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
