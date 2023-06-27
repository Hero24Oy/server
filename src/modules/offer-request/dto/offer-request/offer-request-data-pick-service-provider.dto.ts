import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB, PickStrategy } from 'hero24-types';
import { TypeSafeRequired } from 'src/modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

type PickServiceProviderDB = Exclude<
  OfferRequestDB['data']['pickServiceProvider'],
  undefined
>;
type PickServiceProviderShape = {
  preferred?: string[];
  pickStrategy: PickStrategy;
};

@ObjectType()
export class OfferRequestDataPickServiceProviderDto
  extends FirebaseGraphQLAdapter<
    PickServiceProviderShape,
    PickServiceProviderDB
  >
  implements PickServiceProviderShape
{
  @Field(() => [String], { nullable: true })
  preferred?: string[];

  @Field(() => String)
  pickStrategy: PickStrategy;

  protected toFirebaseType(): TypeSafeRequired<PickServiceProviderDB> {
    return {
      pickStrategy: this.pickStrategy,
      preferred: this.preferred
        ? convertListToFirebaseMap(this.preferred)
        : undefined,
    };
  }

  protected fromFirebaseType(
    serviceProviderPicker: PickServiceProviderDB,
  ): TypeSafeRequired<PickServiceProviderShape> {
    return {
      pickStrategy: serviceProviderPicker.pickStrategy,
      preferred: serviceProviderPicker.preferred
        ? convertFirebaseMapToList(serviceProviderPicker.preferred)
        : undefined,
    };
  }
}
