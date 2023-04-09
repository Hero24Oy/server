import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BuyerProfileDataInput {
  @Field(() => String)
  displayName: string;

  @Field(() => String, { nullable: true })
  photoURL?: string;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: boolean;
}
