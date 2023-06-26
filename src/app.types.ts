import { Request, Response } from 'express';
import { Identity } from './modules/auth/auth.types';
import { FirebaseAppInstance } from './modules/firebase/firebase.types';

export type GraphQLConnectionParams = {
  authorization?: string;
};

export type GraphQLBaseContext = {
  req?: Request;
  res?: Response;
  connectionParams?: GraphQLConnectionParams;
};

export enum AppPlatform {
  APP = 'app',
  STILAUS = 'stilaus',
}

export type AppGraphQLContext = {
  req?: Request;
  res?: Response;
  connectionParams?: GraphQLConnectionParams;
  identity: Identity | null;
  app: FirebaseAppInstance;
  platform: AppPlatform | null;
};
