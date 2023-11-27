import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UploadKycDocumentInput, UploadUboDocumentInput } from '../graphql';
import { MangopayDocumentService } from '../services/document';

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
    return this.documentService.uploadKycDocument(input);
  }

  @Mutation(() => Boolean)
  async uploadUboDeclaration(
    @Args('input') input: UploadUboDocumentInput,
  ): Promise<boolean> {
    return this.documentService.uploadUboDeclaration(input);
  }
}
