import { Field, ObjectType } from '@nestjs/graphql';
import { BuyerProfileDB } from 'hero24-types';
import { MaybeType } from 'src/modules/common/common.types';
import { FirebaseAdapter } from 'src/modules/firebase/firebase.adapter';

@ObjectType()
export class BuyerProfileDataDto {
  @Field(() => String)
  displayName: string;

  @Field(() => String, { nullable: true })
  photoURL?: MaybeType<string>;

  @Field(() => Boolean, { nullable: true })
  isCreatedFromWeb?: MaybeType<boolean>;

  static adapter: FirebaseAdapter<BuyerProfileDB['data'], BuyerProfileDataDto>;
}

BuyerProfileDataDto.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    displayName: internal.displayName,
    isCreatedFromWeb: internal.isCreatedFromWeb,
    photoURL: internal.photoURL,
  }),
  toInternal: (external) => ({
    displayName: external.displayName,
    isCreatedFromWeb: external.isCreatedFromWeb ?? undefined,
    photoURL: external.photoURL ?? undefined,
  }),
});
