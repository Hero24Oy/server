import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, PickStrategy } from 'hero24-types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';

@ObjectType()
export class OfferRequestDataPickServiceProviderDto {
  @Field(() => [String], { nullable: true })
  preferred?: string[];

  @Field(() => String)
  pickStrategy: PickStrategy;

  static convertFromFirebaseType(
    data: Exclude<OfferRequestDB['data']['pickServiceProvider'], undefined>,
  ): OfferRequestDataPickServiceProviderDto {
    return {
      ...data,
      preferred: data.preferred && convertFirebaseMapToList(data.preferred),
    };
  }

  static convertToFirebaseType(
    data: OfferRequestDataPickServiceProviderDto,
  ): Exclude<OfferRequestDB['data']['pickServiceProvider'], undefined> {
    return {
      ...data,
      preferred: data.preferred && convertListToFirebaseMap(data.preferred),
    };
  }
}
