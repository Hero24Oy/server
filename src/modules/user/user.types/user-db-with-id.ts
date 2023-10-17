import { UserDB } from 'hero24-types';

export interface UserDbWithId extends UserDB {
  id: string;
}
