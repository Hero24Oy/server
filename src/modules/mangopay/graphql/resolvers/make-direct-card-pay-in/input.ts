import { Field, InputType } from '@nestjs/graphql';

import { BrowserInfoDataObject } from '../../objects';

@InputType()
export class MakeDirectCardPayInInput {
  @Field(() => String)
  ip: string;

  @Field(() => BrowserInfoDataObject)
  browserInfo: BrowserInfoDataObject; // we need this data to process pay in

  @Field(() => String)
  transactionId: string;

  @Field(() => String)
  cardId: string;

  @Field(() => String)
  redirectUrl: string; // url where it will be redirected after 3ds
}
