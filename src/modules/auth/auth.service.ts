import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { GraphQLBaseContext } from 'src/app.types';
import { Identity } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseService) {}

  async authorizeUser(context: GraphQLBaseContext): Promise<Identity | null> {
    const { req, connectionParams } = context;

    const token = req?.headers.authorization || connectionParams?.authorization;

    if (!token) {
      return null;
    }

    const decodedIdToken = await this.firebaseService.verifyIdToken(token);

    if (!decodedIdToken) {
      return null;
    }

    const isAdmin = await this.firebaseService.getIsAdmin(decodedIdToken.uid);

    return {
      id: decodedIdToken.uid,
      isAdmin,
    };
  }
}
