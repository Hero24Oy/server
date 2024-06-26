import { Injectable } from '@nestjs/common';
import { getDownloadURL } from 'firebase-admin/storage';
import { ImageDB } from 'hero24-types';
import path from 'path';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { ImageCreationInput } from './dto/creation/image-creation.input';
import { ImageDto } from './dto/image/image.dto';
import { ImageDataDto } from './dto/image/image-data.dto';
import { IMAGE_PATH_CHUNKS, STORAGE_PATH } from './image.constants';
import { ImageCategoryType } from './image.types';

@Injectable()
export class ImageService {
  private readonly imageTableRef: FirebaseTableReference<ImageDB>;

  constructor(private readonly firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.imageTableRef = database.ref(FirebaseDatabasePath.IMAGES);
  }

  private async uploadImageToStorage(
    base64Data: string,
    storagePath: string,
  ): Promise<string> {
    const bucket = this.firebaseService.getStorage().bucket();

    const imageData = Buffer.from(base64Data, 'base64');

    const file = bucket.file(storagePath);

    await file.save(imageData, {
      metadata: {
        contentType: 'image/jpg',
      },
    });

    return getDownloadURL(file);
  }

  private async deleteImageFromStorage(storagePath: string): Promise<void> {
    const bucket = this.firebaseService.getStorage().bucket();

    const file = bucket.file(storagePath);

    await file.delete();
  }

  private async getStorageFileUrl(storagePath: string): Promise<string> {
    const storage = this.firebaseService.getStorage().bucket();

    return getDownloadURL(storage.file(storagePath));
  }

  private async getImageData(id: string): Promise<ImageDB | null> {
    const imageDataSnapshot = await this.imageTableRef.child(id).get();

    return imageDataSnapshot.val();
  }

  private async deleteImageFromDB(id: string): Promise<true> {
    await this.imageTableRef.child(id).remove();

    return true;
  }

  private isImageData(imageData: ImageDB | null): imageData is ImageDB {
    return Boolean(imageData);
  }

  private isValidRoute(routeChunks?: string[]): routeChunks is string[] {
    return routeChunks !== undefined && routeChunks?.length > IMAGE_PATH_CHUNKS;
  }

  private isStoragePathDefined(storagePath?: string): storagePath is string {
    return storagePath !== undefined;
  }

  async uploadImage(input: ImageCreationInput): Promise<ImageDto> {
    const { id, base64, category, subcategory, data } = input;

    const storagePath = path.join(STORAGE_PATH, category, subcategory, id);

    const imageData = {
      ...data,
      storagePath,
    } satisfies ImageDataDto;

    try {
      const downloadURL = await this.uploadImageToStorage(base64, storagePath);

      await this.imageTableRef.child(id).child('data').set(imageData);

      const image: ImageDto = {
        id,
        category,
        subcategory,
        downloadURL,
        data: imageData,
      };

      return image;
    } catch {
      throw new Error('Uploading image failed');
    }
  }

  async removeImage(id: string): Promise<true> {
    const imageData = await this.getImageData(id);

    const routeChunks = imageData?.data.storagePath?.split('/');

    if (
      !this.isImageData(imageData) ||
      !this.isValidRoute(routeChunks) ||
      !this.isStoragePathDefined(imageData.data.storagePath)
    ) {
      throw new Error('Image deletion failed');
    }

    try {
      const { storagePath } = imageData.data;

      await Promise.all([
        this.deleteImageFromStorage(storagePath),
        this.deleteImageFromDB(id),
      ]);
    } catch {
      throw new Error('Image deletion failed');
    }

    return true;
  }

  async getImage(id: string): Promise<ImageDto> {
    const imageData = await this.getImageData(id);

    const routeChunks = imageData?.data.storagePath?.split('/');

    if (
      !this.isImageData(imageData) ||
      !this.isValidRoute(routeChunks) ||
      !this.isStoragePathDefined(imageData.data.storagePath)
    ) {
      throw new Error('Loading image failed');
    }

    try {
      const { data } = imageData;
      const { storagePath } = imageData.data;

      const downloadURL = await this.getStorageFileUrl(storagePath);

      const image: ImageDto = {
        id,
        category: routeChunks[1] as ImageCategoryType,
        subcategory: routeChunks[2],
        downloadURL,
        data,
      };

      return image;
    } catch {
      throw new Error('Loading image failed');
    }
  }
}
