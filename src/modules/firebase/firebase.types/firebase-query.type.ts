import { DataSnapshot, EventType, Query } from 'firebase-admin/database';

import { FirebaseEventCallback } from './firebase-event-callback.type';
// eslint-disable-next-line import/no-cycle -- Firebase Reference is required in Firebase Query and vice versa
import { FirebaseReference } from './firebase-reference.type';
import { FirebaseSnapshot } from './firebase-snapshot.type';

import { Keys } from '$/modules/common/common.types';

interface OverriddenQuery<Entity> {
  endAt(
    value: string | number | boolean | null,
    key?: string | undefined,
  ): FirebaseQuery<Entity>;
  endBefore(
    value: string | number | boolean | null,
    key?: string | undefined,
  ): FirebaseQuery<Entity>;
  equalTo(
    value: string | number | boolean | null,
    key?: string | undefined,
  ): FirebaseQuery<Entity>;
  get(): Promise<FirebaseSnapshot<Entity>>;
  limitToFirst(limit: number): FirebaseQuery<Entity>;
  limitToLast(limit: number): FirebaseQuery<Entity>;
  off<Event extends EventType>(
    eventType?: Event,
    callback?: FirebaseEventCallback<Event, Entity>,
  ): void;
  on<Event extends EventType>(
    eventType: Event,
    callback: FirebaseEventCallback<Event, Entity>,
  ): FirebaseEventCallback<Event, Entity>;
  once(eventType: EventType): Promise<DataSnapshot>;
  orderByChild(path: string): FirebaseQuery<Entity>;
  orderByKey(): FirebaseQuery<Entity>;
  orderByPriority(): FirebaseQuery<Entity>;
  orderByValue(): FirebaseQuery<Entity>;
  ref: FirebaseReference<Entity>;
  startAfter(
    value: string | number | boolean | null,
    key?: string | undefined,
  ): FirebaseQuery<Entity>;
  startAt(
    value: string | number | boolean | null,
    key?: string | undefined,
  ): FirebaseQuery<Entity>;
}

type OverriddenFields = Keys<OverriddenQuery<unknown>>;

export type FirebaseQuery<Entity> = Omit<Query, OverriddenFields> &
  OverriddenQuery<Entity>;
