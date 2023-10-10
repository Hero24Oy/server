import { Methods } from './methods';
import { NetvisorAccountKeys } from './netvisor-account-keys';

export interface NetvisorAccountParameters {
  [NetvisorAccountKeys.METHOD]: Methods;
}
