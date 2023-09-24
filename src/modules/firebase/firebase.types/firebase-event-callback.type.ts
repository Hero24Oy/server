import { EventType } from 'firebase-admin/database';

import { FirebaseSnapshot } from './firebase-snapshot.type';

import { Values } from '$/modules/common/common.types';

export type FirebaseEventCallback<Event extends EventType, Entity> = (
  snapshot: Event extends 'value'
    ? FirebaseSnapshot<Entity>
    : FirebaseSnapshot<Values<Entity>>,
) => void;
