import { Field, InputType } from '@nestjs/graphql';

import { BrowserInfoDataObject } from '../../objects';

@InputType()
export class MakeDirectCardPayInInput {
  @Field(() => String)
  ip: string;

  @Field(() => BrowserInfoDataObject)
  browserInfo: BrowserInfoDataObject;

  @Field(() => String)
  transactionId: string;

  @Field(() => String)
  cardId: string;

  @Field(() => String)
  redirectUrl: string;
}
