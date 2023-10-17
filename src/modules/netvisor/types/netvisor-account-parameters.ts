import { Methods, NetvisorAccountKeys } from '../enums';

export interface NetvisorAccountParameters {
  [NetvisorAccountKeys.METHOD]: Methods;
}
