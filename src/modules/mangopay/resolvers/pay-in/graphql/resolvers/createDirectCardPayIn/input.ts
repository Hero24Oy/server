import { Field, InputType } from '@nestjs/graphql';
import { base as MangopayBase } from 'mangopay2-nodejs-sdk';

import { BrowserInfoDataObject } from '../../objects';

@InputType()
export class CreateDirectCardPayInInput {
  @Field(() => String)
  ip: string;

  @Field(() => BrowserInfoDataObject)
  browserInfo: MangopayBase.BrowserInfoData;

  @Field(() => String)
  transactionId: string;

  @Field(() => String)
  cardId: string;

  @Field(() => String)
  returnUrl: string;
}
