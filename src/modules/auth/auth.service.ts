import { Injectable } from '@nestjs/common';

import { GraphQLBaseContext } from 'src/app.types';

import { FirebaseService } from '../firebase/firebase.service';
import { Identity } from './auth.types';
import { SCOPE_SPECIFIER_HEADER_NAME, Scope } from './auth.constants';
import { getScope } from './auth.utils';

@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseService) {}

  async authorizeUser(context: GraphQLBaseContext): Promise<Identity | null> {
    const { req, connectionParams } = context;

    const source = req?.headers || connectionParams || {};

    const token = source.authorization;
    const scope = getScope(source[SCOPE_SPECIFIER_HEADER_NAME]);

    if (!token) {
      return null;
    }

    const decodedIdToken = await this.firebaseService.verifyIdToken(token);

    if (!decodedIdToken) {
      return null;
    }

    let isAdmin = false;

    if (scope === Scope.ADMIN) {
      isAdmin = await this.firebaseService.getIsAdmin(decodedIdToken.uid);
    }

    return {
      id: decodedIdToken.uid,
      scope: isAdmin ? Scope.ADMIN : Scope.USER,
    };
  }
}
