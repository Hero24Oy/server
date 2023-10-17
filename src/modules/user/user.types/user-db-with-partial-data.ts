import { UserDB } from 'hero24-types';

export interface UserDbWithPartialData extends Omit<UserDB, 'data'> {
  data: Partial<UserDB['data']>;
  id: string;
}
