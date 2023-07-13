import { registerEnumType } from '@nestjs/graphql';

enum MergeStatus {
  processing = 'processing',
  completed = 'completed',
  notFound = 'not-found',
  pendingVerify = 'pending-verify',
}

registerEnumType(MergeStatus, {
  name: 'MergeStatus',
});

export default MergeStatus;
