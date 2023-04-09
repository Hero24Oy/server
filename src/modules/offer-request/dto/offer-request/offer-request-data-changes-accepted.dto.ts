import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OfferRequestDataChangesAcceptedDto {
  @Field(() => Boolean)
  detailsChangeAccepted: boolean;

  @Field(() => Boolean)
  timeChangeAccepted: boolean;
}
