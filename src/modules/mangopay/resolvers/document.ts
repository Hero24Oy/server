import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UploadKycDocumentInput, UploadUboDocumentInput } from '../graphql';
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

  @Mutation(() => Boolean)
  async uploadKycDocument(
    @Args('input') input: UploadKycDocumentInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.documentService.uploadKycDocument(id, input);
  }

  @Mutation(() => Boolean)
  async uploadUboDeclaration(
    @Args('input') input: UploadUboDocumentInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.documentService.uploadUboDeclaration(id, input);
  }
}
