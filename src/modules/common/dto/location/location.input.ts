import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class LocationInput {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}
