import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';
import { TypeSafeRequired } from 'src/modules/common/common.types';
import { FirebaseGraphQLAdapter } from 'src/modules/firebase/firebase.interfaces';

type ChangesAcceptedShape = {
  detailsChangeAccepted: boolean;
  timeChangeAccepted: boolean;
};

type ChangesAcceptedDB = Required<OfferRequestDB['data']>['changesAccepted'];

@ObjectType()
export class OfferRequestDataChangesAcceptedDto
  extends FirebaseGraphQLAdapter<ChangesAcceptedShape, ChangesAcceptedDB>
  implements ChangesAcceptedShape
{
  @Field(() => Boolean)
  detailsChangeAccepted: boolean;

  @Field(() => Boolean)
  timeChangeAccepted: boolean;

  protected toFirebaseType(): TypeSafeRequired<ChangesAcceptedDB> {
    return {
      detailsChangeAccepted: this.detailsChangeAccepted,
      timeChangeAccepted: this.timeChangeAccepted,
    };
  }

  protected fromFirebaseType(
    changesAccepted: ChangesAcceptedDB,
  ): TypeSafeRequired<ChangesAcceptedShape> {
    return {
      detailsChangeAccepted: changesAccepted.detailsChangeAccepted,
      timeChangeAccepted: changesAccepted.timeChangeAccepted,
    };
  }
}
