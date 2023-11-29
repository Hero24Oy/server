import { createUnionType } from '@nestjs/graphql';
import { DocumentStatus, KycDocument } from 'hero24-types';

import { MangopayBaseKycDocumentObject } from './base';
import { MangopayRefusedKycDocumentObject } from './refused';

export const MangopayKycDocumentObject = createUnionType({
  name: 'MangopayKycDocumentObject',
  types: () =>
    [MangopayBaseKycDocumentObject, MangopayRefusedKycDocumentObject] as const,
  resolveType: (kycDocument: KycDocument) => {
    if (kycDocument.status === DocumentStatus.REFUSED) {
      return MangopayRefusedKycDocumentObject;
    }

    return MangopayBaseKycDocumentObject;
  },
});

// eslint-disable-next-line @typescript-eslint/no-redeclare -- we need to create type for the union instead of using typeof
export type MangopayKycDocumentObject = typeof MangopayKycDocumentObject;
