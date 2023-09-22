import { DataSnapshot, EventType, Query } from 'firebase-admin/database';

export const subscribeOnFirebaseEvent = <T extends Pick<Query, 'on' | 'off'>>(
  ref: T,
  eventType: EventType,
  eventHandler: (snapshot: DataSnapshot) => void,
): (() => void) => {
  ref.on(eventType, eventHandler);

  return () => ref.off(eventType);
};
