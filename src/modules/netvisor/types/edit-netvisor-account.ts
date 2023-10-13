import { CreateNetvisorAccountArguments } from './create-netvisor-account';

export type EditNetvisorAccountArguments = {
  netvisorKey: string;
} & CreateNetvisorAccountArguments;
