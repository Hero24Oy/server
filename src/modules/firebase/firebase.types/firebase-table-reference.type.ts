import { FirebaseReference } from './firebase-reference.type';
import { FirebaseTable } from './firebase-table.type';

export type FirebaseTableReference<Entity> = FirebaseReference<
  FirebaseTable<Entity>
>;
