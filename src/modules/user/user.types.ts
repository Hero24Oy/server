import { UserDB } from 'hero24-types';

export interface UserDBWithPartialData extends Omit<UserDB, 'data'> {
  id: string;
  data: Partial<UserDB['data']>;
}
