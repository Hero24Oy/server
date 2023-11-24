import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

import { ImageCreationArgs } from './graphql/creation/image-creation.args';
import { FileObject } from './graphql/objects/file';
import { ImageService } from './service';

@Resolver()
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Query(() => FileObject)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async image(@Args('id') id: string): Promise<FileObject> {
    return this.imageService.getImage(id);
  }

  @Mutation(() => FileObject)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async uploadImage(@Args() { input }: ImageCreationArgs): Promise<FileObject> {
    return this.imageService.uploadImage(input);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async removeImage(@Args('id') id: string): Promise<true> {
    return this.imageService.removeImage(id);
  }
}
