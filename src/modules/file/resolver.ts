import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

import {
  FileInput,
  FileOutput,
  RemoveImageInput,
  UploadImageInput,
  UploadImageOutput,
} from './graphql';
import { FileService } from './service';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Query(() => FileOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async file(@Args('input') input: FileInput): Promise<FileOutput> {
    return this.fileService.getFile(input);
  }

  @Mutation(() => UploadImageOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async uploadFile(
    @Args('input') input: UploadImageInput,
  ): Promise<UploadImageOutput> {
    return this.fileService.uploadFile(input);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async removeFile(@Args('input') input: RemoveImageInput): Promise<true> {
    return this.fileService.removeFile(input);
  }
}
