import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import {
  CreateKycDocumentInput,
  CreateKycDocumentOutput,
  SubmitKycDocumentInput,
  UploadKycPageInput,
  UploadUboDocumentInput,
} from '../graphql';
import { MangopayDocumentService } from '../services/document';

import { AuthIdentity } from '$modules/auth/auth.decorator';
import { Identity } from '$modules/auth/auth.types';
import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayDocumentResolver {
  constructor(private readonly documentService: MangopayDocumentService) {}

  @Mutation(() => CreateKycDocumentOutput)
  async createKycDocument(
    @Args('input') input: CreateKycDocumentInput,
    @AuthIdentity() identity: Identity,
  ): Promise<CreateKycDocumentOutput> {
    const { id } = identity;
    const { type } = input;

    const kycDocument = await this.documentService.createKycDocumentByHeroId(
      id,
      {
        Type: type,
      },
    );

    return { kycDocumentId: kycDocument.Id };
  }

  @Mutation(() => Boolean)
  async uploadKycPage(
    @Args('input') input: UploadKycPageInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.documentService.uploadKycPageByHeroId(id, input);
  }

  @Mutation(() => Boolean)
  async submitKycDocument(
    @Args('input') input: SubmitKycDocumentInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.documentService.submitKycDocumentByHeroId(id, input);
  }

  @Mutation(() => Boolean)
  async uploadUboDeclaration(
    @Args('input') input: UploadUboDocumentInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.documentService.uploadUboDeclarationByHeroId(id, input);
  }
}
