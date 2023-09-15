import { Field, ObjectType } from '@nestjs/graphql';
import { UserDB } from 'hero24-types';

import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class UserOfferDto {
  @Field(() => String)
  offerId: string;

  @Field(() => String)
  offerRequestId: string;

  static adapter: FirebaseAdapter<
    Exclude<UserDB['offers'], undefined>,
    UserOfferDto[]
  >;
}

UserOfferDto.adapter = new FirebaseAdapter({
  toInternal: (external) =>
    Object.fromEntries(
      external.map(({ offerId, offerRequestId }) => [
        offerId,
        { offerRequestId },
      ]),
    ),
  toExternal: (internal) =>
    Object.keys(internal).map((offerId) => ({
      offerId,
      offerRequestId: internal[offerId]!.offerRequestId,
    })),
});
