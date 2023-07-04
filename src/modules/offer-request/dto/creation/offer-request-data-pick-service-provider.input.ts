import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestDB, PickStrategy } from 'hero24-types';
import { TypeSafeRequired } from 'src/modules/common/common.types';
import {
  convertFirebaseMapToList,
  convertListToFirebaseMap,
} from 'src/modules/common/common.utils';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

export type PickServiceProviderShape = {
  pickStrategy: PickStrategy;
  preferred: string[];
};

export type PickServiceProviderInputShape = PickServiceProviderShape;

type PickServiceProviderDB = Required<
  OfferRequestDB['data']
>['pickServiceProvider'];

@InputType()
export class OfferRequestDataPickServiceProviderInput extends FirebaseGraphQLAdapter<
  PickServiceProviderShape,
  PickServiceProviderDB
> {
  constructor(shape?: PickServiceProviderInputShape) {
    super(shape);
  }

  @Field(() => String)
  pickStrategy: PickStrategy;

  @Field(() => [String])
  preferred: string[];

  protected toFirebaseType(): TypeSafeRequired<PickServiceProviderDB> {
    return {
      pickStrategy: this.pickStrategy,
      preferred: convertListToFirebaseMap(this.preferred),
    };
  }

  protected fromFirebaseType(
    firebase: PickServiceProviderDB,
  ): TypeSafeRequired<PickServiceProviderShape> {
    return {
      pickStrategy: firebase.pickStrategy,
      preferred: convertFirebaseMapToList(firebase.preferred || {}),
    };
  }
}
