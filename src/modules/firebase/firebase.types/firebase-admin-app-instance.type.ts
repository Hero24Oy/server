import * as admin from 'firebase-admin';

import { FirebaseDatabase } from './firebase-database.type';

type FirebaseApp = admin.app.App;

type OverriddenFields = 'database';

export type FirebaseAdminAppInstance = Omit<FirebaseApp, OverriddenFields> & {
  database(url?: string): FirebaseDatabase;
};
