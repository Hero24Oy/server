import { Database } from 'firebase-admin/database';

import { FirebaseReference } from './firebase-reference.type';

type OverriddenFields = 'ref' | 'refFromURL';

export type FirebaseDatabase = Omit<Database, OverriddenFields> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- it's necessary to avoid errors in exists files. TODO: delete it during refactoring
  ref<Entity = any>(path: string): FirebaseReference<Entity>;
  refFromURL<Entity>(path: string): FirebaseReference<Entity>;
};
