import { Field, Float, InputType } from '@nestjs/graphql';
import { PurchaseInput } from './purchase.input';

@InputType()
export class InitialDataInput {
  // set by server
  readonly createdAt: number;

  @Field(() => Date)
  agreedStartTime: Date;

  @Field(() => String)
  buyerProfileId: string;

  @Field(() => String)
  sellerProfileId: string;

  @Field(() => Float)
  pricePerHour: number;

  @Field(() => String)
  offerRequestId: string;

  @Field(() => PurchaseInput)
  purchase: PurchaseInput;
}
