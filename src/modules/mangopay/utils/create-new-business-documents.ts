import {
  BusinessDocuments,
  DocumentStatus,
  KycDocument,
  KycTypes,
} from 'hero24-types';

const notLoadedKycDocument: KycDocument = {
  status: DocumentStatus.NOT_LOADED,
};

type ReturnType = {
  kycStatus: BusinessDocuments;
  uboStatus: DocumentStatus;
};

export const createNewBusinessDocuments = (): ReturnType => {
  return {
    kycStatus: {
      [KycTypes.IDENTITY_PROOF]: notLoadedKycDocument,
      [KycTypes.REGISTRATION_PROOF]: notLoadedKycDocument,
      [KycTypes.ARTICLES_OF_ASSOCIATION]: notLoadedKycDocument,
      [KycTypes.SHAREHOLDER_DECLARATION]: notLoadedKycDocument,
    },
    uboStatus: DocumentStatus.NOT_LOADED,
  };
};
