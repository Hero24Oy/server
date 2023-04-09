import { Field, ObjectType } from '@nestjs/graphql';
import { SuitableTimes } from 'hero24-types';
import { SuitableTimeItemDto } from './suitable-time-item.dto';

@ObjectType()
export class SuitableTimeDto {
  @Field(() => String)
  key: string;

  @Field(() => SuitableTimeItemDto)
  time: SuitableTimeItemDto;

  static convertFromFirebaseTime(data: SuitableTimes): SuitableTimeDto[] {
    return Object.entries(data).map(([key, time]) => ({
      key,
      time: SuitableTimeItemDto.convertFromFirebaseTime(time),
    }));
  }

  static convertToFirebaseTime(data: SuitableTimeDto[]): SuitableTimes {
    return Object.fromEntries(
      data.map((item) => [
        item.key,
        SuitableTimeItemDto.convertToFirebaseTime(item.time),
      ]),
    );
  }
}
