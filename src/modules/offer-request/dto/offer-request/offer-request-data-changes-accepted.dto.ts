import { Field, ObjectType } from '@nestjs/graphql';
import { OfferRequestDB } from 'hero24-types';

import { FirebaseAdapter } from '$/src/modules/firebase/firebase.adapter';

type ChangesAcceptedDB = Required<OfferRequestDB['data']>['changesAccepted'];

@ObjectType()
export class OfferRequestDataChangesAcceptedDto {
  @Field(() => Boolean)
  detailsChangeAccepted: boolean;

  @Field(() => Boolean)
  timeChangeAccepted: boolean;

  static adapter: FirebaseAdapter<
    ChangesAcceptedDB,
    OfferRequestDataChangesAcceptedDto
  >;
}

OfferRequestDataChangesAcceptedDto.adapter = new FirebaseAdapter({
  toInternal: (external) => ({
    detailsChangeAccepted: external.detailsChangeAccepted,
    timeChangeAccepted: external.timeChangeAccepted,
  }),
  toExternal: (internal) => ({
    detailsChangeAccepted: internal.detailsChangeAccepted,
    timeChangeAccepted: internal.timeChangeAccepted,
  }),
});
