import { DataSnapshot } from 'firebase-admin/database';

type OverriddenFields = 'val';

export type FirebaseSnapshot<Entity> = Omit<DataSnapshot, OverriddenFields> & {
  val(): Entity | null;
};
