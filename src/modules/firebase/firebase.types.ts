import * as firebase from 'firebase/app';
import * as admin from 'firebase-admin';
import * as storage from 'firebase-admin/storage';

export type FirebaseAppInstance = firebase.FirebaseApp;

export type FirebaseAdminAppInstance = admin.app.App;

export type FirebaseAdminStorage = storage.Storage;
