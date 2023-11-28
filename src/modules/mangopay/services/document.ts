import { Injectable } from '@nestjs/common';
import {
  kycDocument as MangopayKycDocument,
  uboDeclaration as MangopayUboDeclaration,
} from 'mangopay2-nodejs-sdk';

import { MangopayDocumentStatus } from '../enums';
import { UploadKycDocumentInput, UploadUboDocumentInput } from '../graphql';
import {
  CreateKycPageParameters,
  CreateUboParameters,
  GetUboParameters,
  MangopaySearchParameters,
} from '../types';

import { MangopayInstanceService } from './instance';

@Injectable()
export class MangopayDocumentService {
  constructor(private readonly api: MangopayInstanceService) {}

  async createUboDeclaration(
    userId: string,
  ): Promise<MangopayUboDeclaration.UboDeclarationData> {
    return this.api.UboDeclarations.create(userId);
  }

  async createUbo(
    parameters: CreateUboParameters,
  ): Promise<MangopayUboDeclaration.UboData> {
    const { userId, uboDeclarationId, data } = parameters;

    return this.api.UboDeclarations.createUbo(userId, uboDeclarationId, data);
  }

  async getUboDeclaration(
    userId: string,
    uboDeclarationId: string,
  ): Promise<MangopayUboDeclaration.UboDeclarationData> {
    return this.api.UboDeclarations.get(userId, uboDeclarationId);
  }

  async getAllUboDeclarationsByUserId(
    userId: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayUboDeclaration.UboDeclarationData[]> {
    return this.api.UboDeclarations.getAll(userId, { parameters });
  }

  async getUbo(
    parameters: GetUboParameters,
  ): Promise<MangopayUboDeclaration.UboData> {
    const { userId, uboDeclarationId, uboId } = parameters;

    return this.api.UboDeclarations.getUbo(userId, uboDeclarationId, uboId);
  }

  async askUboValidate(
    userId: string,
    uboDeclarationId: string,
  ): Promise<MangopayUboDeclaration.UboDeclarationData> {
    return this.api.UboDeclarations.update(userId, {
      Id: uboDeclarationId,
      Status: MangopayDocumentStatus.VALIDATION_ASKED,
    });
  }

  async createKycDocument(
    userId: string,
    data: MangopayKycDocument.CreateKycDocument,
  ): Promise<MangopayKycDocument.KycDocumentData> {
    return this.api.Users.createKycDocument(userId, data);
  }

  async createKycPage(
    parameters: CreateKycPageParameters,
  ): Promise<MangopayKycDocument.KycDocumentData> {
    const { userId, kycDocumentId, base64 } = parameters;

    return this.api.Users.createKycPage(userId, kycDocumentId, {
      File: base64,
    });
  }

  async askKycValidate(
    userId: string,
    kycDocumentId: string,
  ): Promise<MangopayKycDocument.KycDocumentData> {
    return this.api.Users.updateKycDocument(userId, {
      Id: kycDocumentId,
      Status: MangopayDocumentStatus.VALIDATION_ASKED,
    });
  }

  async getKycDocument(
    userId: string,
    kycDocumentId: string,
  ): Promise<MangopayKycDocument.KycDocumentData> {
    return this.api.Users.getKycDocument(userId, kycDocumentId);
  }

  async getAllKycDocumentsByUserId(
    userId: string,
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayKycDocument.KycDocumentData[]> {
    return this.api.Users.getKycDocuments(userId, { parameters });
  }

  async getAllKycDocument(
    parameters?: MangopaySearchParameters,
  ): Promise<MangopayKycDocument.KycDocumentData[]> {
    return this.api.KycDocuments.getAll({ parameters });
  }

  async uploadKycDocument(
    userId: string,
    input: UploadKycDocumentInput,
  ): Promise<boolean> {
    const { type, base64 } = input;

    try {
      const kycDocument = await this.createKycDocument(userId, {
        Type: type,
      });

      await this.createKycPage({
        kycDocumentId: kycDocument.Id,
        userId,
        base64,
      });

      await this.askKycValidate(userId, kycDocument.Id);

      return true;
    } catch {
      return false;
    }
  }

  async uploadUboDeclaration(
    userId: string,
    input: UploadUboDocumentInput,
  ): Promise<boolean> {
    const { beneficialOwners } = input;

    try {
      const uboDeclaration = await this.createUboDeclaration(userId);

      await Promise.all(
        beneficialOwners.map(async (beneficialOwner) => {
          return this.createUbo({
            uboDeclarationId: uboDeclaration.Id,
            userId,
            data: {
              Address: {
                AddressLine1: beneficialOwner.address.addressLine,
                AddressLine2: '',
                City: beneficialOwner.address.city,
                Country: beneficialOwner.address.country,
                PostalCode: beneficialOwner.address.postalCode,
                Region: beneficialOwner.address.region ?? '',
              },
              Birthday: beneficialOwner.birthday.getTime(),
              Birthplace: {
                City: beneficialOwner.birthplace.city,
                Country: beneficialOwner.birthplace.country,
              },
              FirstName: beneficialOwner.firstName,
              LastName: beneficialOwner.lastName,
              Nationality: beneficialOwner.nationality,
            },
          });
        }),
      );

      await this.askKycValidate(userId, uboDeclaration.Id);

      return true;
    } catch {
      return false;
    }
  }
}
