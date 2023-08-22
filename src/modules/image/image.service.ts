import path from 'path';
import { Injectable } from '@nestjs/common';
import { getDownloadURL } from 'firebase-admin/storage';
import { ImageDB } from 'hero24-types';

import { ImageCreationInput } from './dto/creation/image-creation.input';
import { FirebaseService } from '../firebase/firebase.service';

import { ImageDataDto } from './dto/image/image-data.dto';
import { ImageDto } from './dto/image/image.dto';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { STORAGE_PATH } from './image.constants';
import { ImageCategoryType } from './image.types';

@Injectable()
export class ImageService {
  constructor(private readonly firebaseService: FirebaseService) {}

  private async uploadImageToStorage(base64Data: string, storagePath: string) {
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

  private async deleteImageFromStorage(storagePath: string) {
    const bucket = this.firebaseService.getStorage().bucket();

    const file = bucket.file(storagePath);

    return file.delete();
  }

  private async getStorageFileURL(path: string) {
    const storage = this.firebaseService.getStorage().bucket();

    return getDownloadURL(storage.file(path));
  }

  private async getImageData(id: string): Promise<ImageDB | null> {
    const database = this.firebaseService.getDefaultApp().database();
    const imageDataSnapshot = await database
      .ref(FirebaseDatabasePath.IMAGES)
      .child(id)
      .get();
    const imageData: ImageDB | null = imageDataSnapshot.val();

    return imageData;
  }

  private async deleteImageFromDB(id: string): Promise<true> {
    const database = this.firebaseService.getDefaultApp().database();

    await database.ref(FirebaseDatabasePath.IMAGES).child(id).remove();

    return true;
  }

  private isImageData(imageData: ImageDB | null): imageData is ImageDB {
    return Boolean(imageData);
  }

  private isValidRoute(routeChunks?: string[]): routeChunks is string[] {
    return routeChunks !== undefined && routeChunks?.length > 3;
  }

  private isStoragePathDefined(path?: string): path is string {
    return path !== undefined;
  }

  async uploadImage(input: ImageCreationInput): Promise<ImageDto> {
    const { id, base64, category, subcategory, data } = input;

    const storagePath = path.join(STORAGE_PATH, category, subcategory, id);

    const imageData: ImageDataDto = {
      ...data,
      storagePath,
    };
    try {
      const downloadURL = await this.uploadImageToStorage(base64, storagePath);

      const database = this.firebaseService.getDefaultApp().database();

      await database
        .ref(FirebaseDatabasePath.IMAGES)
        .child(id)
        .child('data')
        .set(imageData);

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
      throw new Error(`Image deletion failed`);
    }

    try {
      const { storagePath } = imageData.data;

      await Promise.all([
        this.deleteImageFromStorage(storagePath),
        this.deleteImageFromDB(id),
      ]);
    } catch {
      throw new Error(`Image deletion failed`);
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
      throw new Error(`Loading image failed`);
    }

    try {
      const { data } = imageData;
      const { storagePath } = imageData.data;

      const downloadURL = await this.getStorageFileURL(storagePath);

      const image: ImageDto = {
        id,
        category: routeChunks[1] as ImageCategoryType,
        subcategory: routeChunks[2],
        downloadURL,
        data,
      };

      return image;
    } catch {
      throw new Error(`Loading image failed`);
    }
  }
}
