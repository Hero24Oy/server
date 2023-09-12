/* eslint-disable @typescript-eslint/naming-convention */
import { registerEnumType } from '@nestjs/graphql';

// Todo: change to uppercase this
// TODO: check that pendingVerify and notFound handles correct by the client
export enum MergeStatus {
  processing = 'processing',
  completed = 'completed',
  notFound = 'not-found',
  pendingVerify = 'pending-verify',
}

registerEnumType(MergeStatus, {
  name: 'MergeStatus',
});
