import { Database } from 'firebase-admin/database';

import { FirebaseReference } from './firebase-reference.type';

type OverriddenFields = 'ref';

export type FirebaseDatabase = Omit<Database, OverriddenFields> & {
  ref<Entity>(path: string): FirebaseReference<Entity>;
};
