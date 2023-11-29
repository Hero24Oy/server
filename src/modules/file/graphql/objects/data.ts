import { Field, Int, ObjectType } from '@nestjs/graphql';
import { File } from 'hero24-types';

import { MaybeType } from '$modules/common/common.types';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

@ObjectType()
export class FileDataObject {
  @Field(() => Int, { nullable: true })
  width?: MaybeType<number>;

  @Field(() => Int, { nullable: true })
  height?: MaybeType<number>;

  @Field(() => String, { nullable: true })
  name?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  storagePath?: MaybeType<string>;

  static adapter: FirebaseAdapter<File['data'], FileDataObject>;
}

FileDataObject.adapter = new FirebaseAdapter({
  toExternal: (internal) => ({
    width: internal.width,
    height: internal.height,
    name: internal.name,
    storagePath: internal.storagePath,
  }),

  toInternal: (external) => ({
    width: external.width ?? undefined,
    height: external.height ?? undefined,
    name: external.name ?? undefined,
    storagePath: external.storagePath ?? undefined,
  }),
});
