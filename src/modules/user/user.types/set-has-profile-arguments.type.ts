import { SetHasProfileValues } from './set-has-profile-values.type';

export interface SetHasProfileArguments {
  hasProfile: boolean;
  id: string;
  value: `${SetHasProfileValues}`;
}
