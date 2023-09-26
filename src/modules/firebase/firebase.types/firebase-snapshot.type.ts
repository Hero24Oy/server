import { DataSnapshot } from 'firebase-admin/database';

import { Values } from '$/modules/common/common.types';

type OverriddenFields = 'val' | 'forEach';

export type FirebaseSnapshot<Entity> = Omit<DataSnapshot, OverriddenFields> & {
  forEach(
    action: (snapshot: FirebaseSnapshot<Values<Entity>>) => boolean | void,
  ): boolean;
  val(): Entity | null;
};
