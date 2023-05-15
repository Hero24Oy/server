import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationInput {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}
