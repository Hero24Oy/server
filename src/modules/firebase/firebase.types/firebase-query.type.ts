import { EventType, Query } from 'firebase-admin/database';

import { FirebaseEventCallback } from './firebase-event-callback.type';
import { FirebaseSnapshot } from './firebase-snapshot.type';

type OverriddenFields = 'get' | 'limitToLast' | 'limitToFirst' | 'on' | 'off';

export type FirebaseQuery<Entity> = Omit<Query, OverriddenFields> & {
  get(): Promise<FirebaseSnapshot<Entity>>;
  limitToFirst(limit: number): FirebaseQuery<Entity>;
  limitToLast(limit: number): FirebaseQuery<Entity>;
  off(
    eventType?: EventType,
    callback?: FirebaseEventCallback<Entity>,
    context?: unknown,
  ): void;
  on(
    eventType: EventType,
    callback: FirebaseEventCallback<Entity>,
  ): FirebaseEventCallback<Entity>;
};
