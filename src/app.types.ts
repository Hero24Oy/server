import DataLoader from 'dataloader';
import { Request, Response } from 'express';

import { Identity } from './modules/auth/auth.types';
import { FirebaseAppInstance } from './modules/firebase/firebase.types';
import { UserDto } from './modules/user/dto/user/user.dto';
import { BuyerProfileDto } from './modules/buyer/dto/buyer/buyer-profile.dto';

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
  userLoader: DataLoader<string, UserDto | null>;
  buyerLoader: DataLoader<string, BuyerProfileDto | null>;
};
