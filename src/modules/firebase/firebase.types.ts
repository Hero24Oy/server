import * as admin from 'firebase-admin';
import * as firebase from 'firebase/app';

export type FirebaseAppInstance = firebase.FirebaseApp;
export type FirebaseAdminAppInstance = admin.app.App;
export type FirebaseUserRecord = admin.auth.UserRecord;
