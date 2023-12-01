import {
  DocumentStatus,
  KycDocument,
  KycTypes,
  SoletraderDocuments,
} from 'hero24-types';

const notLoadedKycDocument: KycDocument = {
  status: DocumentStatus.NOT_LOADED,
};

type ReturnType = {
  kycStatus: SoletraderDocuments;
};

export const createNewSoletraderDocuments = (): ReturnType => {
  return {
    kycStatus: {
      [KycTypes.IDENTITY_PROOF]: notLoadedKycDocument,
      [KycTypes.REGISTRATION_PROOF]: notLoadedKycDocument,
    },
  };
};
