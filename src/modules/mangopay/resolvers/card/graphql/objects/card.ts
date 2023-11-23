import { Field, ObjectType } from '@nestjs/graphql';
import { card as MangopayCard } from 'mangopay2-nodejs-sdk';

@ObjectType()
export class CardObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  expirationDate: string;

  @Field(() => String)
  alias: string;

  @Field(() => String)
  type: MangopayCard.CardType;

  @Field(() => Boolean)
  active: boolean;
}
