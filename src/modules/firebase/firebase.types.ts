import * as firebase from 'firebase/app';
import * as admin from 'firebase-admin';
import * as storage from 'firebase-admin/storage';

import { ConfigType } from '$config';

export type FirebaseAppInstance = firebase.FirebaseApp;

export type FirebaseAdminAppInstance = admin.app.App;

export type FirebaseAdminStorage = storage.Storage;

export type FirebaseConfig = ConfigType['firebase']['clientSdk'];
