import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PartialBuyerProfileDataInput {
  @Field(() => String, { nullable: true })
  displayName?: string;

  @Field(() => String, { nullable: true })
  photoURL?: string;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: boolean;
}
