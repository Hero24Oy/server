import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { SuitableTime } from 'hero24-types';

@ObjectType()
@InputType('SuitableTimeItemInput')
export class SuitableTimeItemDto {
  @Field(() => String)
  day: string;

  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;

  static convertFromFirebaseTime(data: SuitableTime): SuitableTimeItemDto {
    return {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    };
  }

  static convertToFirebaseTime(data: SuitableTimeItemDto): SuitableTime {
    return {
      ...data,
      startTime: +new Date(data.startTime),
      endTime: +new Date(data.endTime),
    };
  }
}
