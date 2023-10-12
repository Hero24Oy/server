import { ProfileStatus } from './set-has-profile-values.type';

export interface SetHasProfileArguments {
  hasProfile: boolean;
  id: string;
  value: `${ProfileStatus}`;
}
