import { CreateNetvisorAccountArguments } from './create-netvisor-account-arguments';

export type EditNetvisorAccountArguments = {
  netvisorKey: string;
} & CreateNetvisorAccountArguments;
