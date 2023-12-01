import { Field, ObjectType } from '@nestjs/graphql';
import { card as MangopayCard } from 'mangopay2-nodejs-sdk';

@ObjectType()
export class CardObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  expirationDate: string; // The expiration date of the card in format: “MMYY”.

  @Field(() => String)
  alias: string; // The card number, partially obfuscated.

  @Field(() => String)
  type: MangopayCard.CardType;

  @Field(() => Boolean)
  active: boolean;
}
