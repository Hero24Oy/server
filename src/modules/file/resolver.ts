import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

import {
  FileInput,
  FileOutput,
  ImageCreationInput,
  ImageDto,
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

    return this.fileService.getFileById(id);
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
    const { id } = input;

    return this.fileService.removeFileById(id);
  }

  /**
   * @deprecated `image` resolver is legacy, use `file` instead.
   */
  @Query(() => ImageDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async image(@Args('id') id: string): Promise<ImageDto> {
    const { file } = await this.fileService.getFileById(id);

    return file;
  }

  /**
   * @deprecated `uploadImage` resolver is legacy, use `uploadFile` instead.
   */
  @Mutation(() => ImageDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async uploadImage(
    @Args('input') input: ImageCreationInput,
  ): Promise<ImageDto> {
    const { file } = await this.fileService.uploadFile(input);

    return file;
  }

  /**
   * @deprecated `removeImage` resolver is legacy, use `removeFile` instead.
   */
  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async removeImage(@Args('id') id: string): Promise<true> {
    return this.fileService.removeFileById(id);
  }
}
