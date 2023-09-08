import { Scope } from './auth.constants';

export const getScope = (scope?: unknown): Scope => {
  switch (scope) {
    case Scope.USER:
    case Scope.ADMIN:
      return scope;
    default:
      return Scope.USER;
  }
};
