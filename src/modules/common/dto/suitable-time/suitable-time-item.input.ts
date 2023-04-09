import { Field, InputType } from '@nestjs/graphql';
import { SuitableTime } from 'hero24-types';

@InputType()
export class SuitableTimeItemInput {
  @Field(() => String)
  day: string;

  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;

  static convertFromFirebaseTime(data: SuitableTime): SuitableTimeItemInput {
    return {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    };
  }

  static convertToFirebaseTime(data: SuitableTimeItemInput): SuitableTime {
    return {
      ...data,
      startTime: +new Date(data.startTime),
      endTime: +new Date(data.endTime),
    };
  }
}
