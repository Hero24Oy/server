import { Field, ObjectType } from '@nestjs/graphql';
import { card as MangopayCard, CurrencyISO } from 'mangopay2-nodejs-sdk';

@ObjectType()
export class Card {
  @Field(() => String)
  ExpirationDate: string;

  @Field(() => String)
  Alias: string;

  @Field(() => String)
  CardProvider: string;

  @Field(() => String)
  CardType: MangopayCard.CardType;

  @Field(() => String)
  Country: string;

  @Field(() => String)
  Product: string;

  @Field(() => String)
  BankCode: string;

  @Field(() => Boolean)
  Active: boolean;

  @Field(() => String)
  Currency: CurrencyISO;

  @Field(() => String)
  Validity: MangopayCard.CardValidity;

  @Field(() => String)
  Fingerprint: string;
}
