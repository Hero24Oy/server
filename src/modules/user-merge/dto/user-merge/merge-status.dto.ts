import { registerEnumType } from '@nestjs/graphql';

export enum MergeStatus {
  processing = 'processing',
  completed = 'completed',
  notFound = 'not-found',
  pendingVerify = 'pending-verify',
}

registerEnumType(MergeStatus, {
  name: 'MergeStatus',
});
