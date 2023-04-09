import { Field, InputType } from '@nestjs/graphql';
import { SuitableTimes } from 'hero24-types';

import { SuitableTimeItemInput } from './suitable-time-item.input';

@InputType()
export class SuitableTimeInput {
  @Field(() => String)
  key: string;

  @Field(() => SuitableTimeItemInput)
  time: SuitableTimeItemInput;

  static convertFromFirebaseTime(data: SuitableTimes): SuitableTimeInput[] {
    return Object.entries(data).map(([key, time]) => ({
      key,
      time: SuitableTimeItemInput.convertFromFirebaseTime(time),
    }));
  }

  static convertToFirebaseTime(data: SuitableTimeInput[]): SuitableTimes {
    return Object.fromEntries(
      data.map((item) => [
        item.key,
        SuitableTimeItemInput.convertToFirebaseTime(item.time),
      ]),
    );
  }
}
