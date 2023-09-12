import DataLoader from 'dataloader';
import { Request, Response } from 'express';

import { Identity } from './modules/auth/auth.types';
import { BuyerProfileDto } from './modules/buyer/dto/buyer/buyer-profile.dto';
import { ChatMessageDto } from './modules/chat/dto/chat/chat-message.dto';
import { FirebaseAppInstance } from './modules/firebase/firebase.types';
import { SellerProfileDto } from './modules/seller/dto/seller/seller-profile.dto';
import { UserDto } from './modules/user/dto/user/user.dto';

export type GraphQlConnectionParams = {
  authorization?: string;
};

export type GraphQlBaseContext = {
  connectionParams?: GraphQlConnectionParams;
  req?: Request;
  res?: Response;
};

export type AppGraphQlContext = {
  app: FirebaseAppInstance;
  buyerLoader: DataLoader<string, BuyerProfileDto | null>;
  chatMessageLoader: DataLoader<string, ChatMessageDto | null>;
  identity: Identity | null;
  sellerLoader: DataLoader<string, SellerProfileDto | null>;
  userLoader: DataLoader<string, UserDto | null>;
  connectionParams?: GraphQlConnectionParams;
  req?: Request;
  res?: Response;
};
