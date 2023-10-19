import { registerEnumType } from '@nestjs/graphql';

export enum MergeStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  NOT_FOUND = 'not-found',
  PENDING_VERIFY = 'pending-verify',
}

registerEnumType(MergeStatus, {
  name: 'MergeStatus',
});
