import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationDto {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}
