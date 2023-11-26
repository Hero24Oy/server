import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

import {
  FileInput,
  FileOutput,
  RemoveFileInput,
  UploadFileInput,
  UploadFileOutput,
} from './graphql';
import { FileService } from './service';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Query(() => FileOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async file(@Args('input') input: FileInput): Promise<FileOutput> {
    const { id } = input;

    return this.fileService.getFile(id);
  }

  @Mutation(() => UploadFileOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async uploadFile(
    @Args('input') input: UploadFileInput,
  ): Promise<UploadFileOutput> {
    return this.fileService.uploadFile(input);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async removeFile(@Args('input') input: RemoveFileInput): Promise<true> {
    return this.fileService.removeFile(input);
  }
}
