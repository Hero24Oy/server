import { Field, InputType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';
import {
  OfferRequestDataInitialInput,
  OfferRequestInitialDataInputShape,
} from './offer-request-data-initial.input';
import {
  OfferRequestDataPickServiceProviderInput,
  PickServiceProviderInputShape,
} from './offer-request-data-pick-service-provider.input';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';
import { TypeSafeRequired } from 'src/modules/common/common.types';

type OfferRequestDataInputShape = {
  initial: OfferRequestInitialDataInputShape;
  pickServiceProvider: PickServiceProviderInputShape;
};

type OfferRequestDataShape = {
  initial: OfferRequestDataInitialInput;
  pickServiceProvider: OfferRequestDataPickServiceProviderInput;
};

type OfferRequestDataCreationDB = Pick<
  OfferRequestDB['data'],
  'pickServiceProvider' | 'status' | 'initial'
>;

@InputType()
export class OfferRequestDataInput extends FirebaseGraphQLAdapter<
  OfferRequestDataShape,
  OfferRequestDataCreationDB
> {
  constructor(shape?: OfferRequestDataInputShape) {
    super(
      shape && {
        pickServiceProvider: new OfferRequestDataPickServiceProviderInput(
          shape.pickServiceProvider,
        ),
        initial: new OfferRequestDataInitialInput(shape.initial),
      },
    );
  }

  @Field(() => OfferRequestDataInitialInput)
  initial: OfferRequestDataInitialInput;

  @Field(() => OfferRequestDataPickServiceProviderInput)
  pickServiceProvider: OfferRequestDataPickServiceProviderInput;

  protected toFirebaseType(): TypeSafeRequired<OfferRequestDataCreationDB> {
    return {
      status: 'open',
      initial: this.initial.toFirebase(),
      pickServiceProvider: this.pickServiceProvider.toFirebase(),
    };
  }

  public fromFirebaseType(): this {
    throw new Error('Should never use');
  }
}
