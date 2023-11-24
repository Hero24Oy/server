import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';

import {
  ImageInput,
  ImageOutput,
  RemoveImageInput,
  UploadImageInput,
  UploadImageOutput,
} from './graphql';
import { ImageService } from './service';

@Resolver()
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Query(() => ImageOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async image(@Args('input') input: ImageInput): Promise<ImageOutput> {
    return this.imageService.getImage(input);
  }

  @Mutation(() => UploadImageOutput)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async uploadImage(
    @Args('input') input: UploadImageInput,
  ): Promise<UploadImageOutput> {
    return this.imageService.uploadImage(input);
  }

  @Mutation(() => Boolean)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async removeImage(@Args('input') input: RemoveImageInput): Promise<true> {
    return this.imageService.removeImage(input);
  }
}
