import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';
import { FileDB } from '$modules/file/types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class FileDataObject {
  @Field(() => String, { nullable: true })
  name?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  storagePath?: MaybeType<string>;

  static adapter: FirebaseAdapter<FileDB['data'], FileDataObject>;
}

FileDataObject.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    name: internal.name,
    storagePath: internal.storagePath,
  }),

  toInternal: (external) => ({
    name: external.name ?? undefined,
    storagePath: external.storagePath ?? undefined,
  }),
});
