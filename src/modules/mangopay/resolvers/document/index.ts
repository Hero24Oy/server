import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { MangopayDocumentService } from '../../services/document';

import { UploadKycDocumentInput, UploadUboDocumentInput } from './graphql';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayDocumentResolver {
  constructor(private readonly documentService: MangopayDocumentService) {}

  @Mutation(() => Boolean)
  async uploadKycDocument(
    @Args('input') input: UploadKycDocumentInput,
  ): Promise<boolean> {
    const { userId, type, base64 } = input;

    try {
      const kycDocument = await this.documentService.createKycDocument(userId, {
        Type: type,
      });

      await this.documentService.createKycPage({
        kycDocumentId: kycDocument.Id,
        userId,
        base64,
      });

      await this.documentService.askKycValidate(userId, kycDocument.Id);

      return true;
    } catch {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async uploadUboDeclaration(
    @Args('input') input: UploadUboDocumentInput,
  ): Promise<boolean> {
    const { userId, beneficialOwners } = input;

    try {
      const uboDeclaration = await this.documentService.createUboDeclaration(
        userId,
      );

      await Promise.all(
        beneficialOwners.map(async (beneficialOwner) => {
          return this.documentService.createUbo({
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
              Birthday: beneficialOwner.birthday,
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

      await this.documentService.askKycValidate(userId, uboDeclaration.Id);

      return true;
    } catch {
      return false;
    }
  }
}
