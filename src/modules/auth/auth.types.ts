import { Scope } from './auth.constants';

export type Identity = {
  id: string;
  scope: Scope;
};
