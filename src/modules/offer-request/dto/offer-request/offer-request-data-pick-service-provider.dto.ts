import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, PickStrategy } from 'hero24-types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';
import { FirebaseAdapter } from 'src/modules/firebase/firebase-adapter.interfaces';

type PickServiceProviderDB = Exclude<
  OfferRequestDB['data']['pickServiceProvider'],
  undefined
>;

@ObjectType()
@InputType('OfferRequestDataPickServiceProviderInput')
export class OfferRequestDataPickServiceProviderDto {
  @Field(() => [String], { nullable: true })
  preferred?: string[];

  @Field(() => String)
  pickStrategy: PickStrategy;

  static adapter: FirebaseAdapter<
    PickServiceProviderDB,
    OfferRequestDataPickServiceProviderDto
  >;
}

OfferRequestDataPickServiceProviderDto.adapter = new FirebaseAdapter({
  toInternal(external) {
    return {
      pickStrategy: external.pickStrategy,
      preferred: external.preferred
        ? convertListToFirebaseMap(external.preferred)
        : undefined,
    };
  },
  toExternal(internal) {
    return {
      pickStrategy: internal.pickStrategy,
      preferred: internal.preferred
        ? convertFirebaseMapToList(internal.preferred)
        : undefined,
    };
  },
});
