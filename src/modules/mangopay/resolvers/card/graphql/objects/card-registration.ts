import { Field, ObjectType } from '@nestjs/graphql';
import { card as MangopayCard, CurrencyISO } from 'mangopay2-nodejs-sdk';

@ObjectType()
export class CardRegistration {
  @Field(() => String)
  UserId: string;

  @Field(() => String)
  Currency: CurrencyISO;

  @Field(() => String)
  AccessKey: string;

  @Field(() => String)
  PreregistrationData: string;

  @Field(() => String)
  CardRegistrationURL: string;

  @Field(() => String)
  RegistrationData: string;

  @Field(() => String)
  CardType: MangopayCard.CardType;

  @Field(() => String)
  CardId: string;

  @Field(() => String)
  ResultCode: string;

  @Field(() => String)
  ResultMessage: string;

  @Field(() => String)
  Status: MangopayCard.CardStatus;
}
