import { Injectable } from '@nestjs/common';
import { getDownloadURL } from 'firebase-admin/storage';
import path from 'path';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { IMAGE_PATH_CHUNKS, STORAGE_PATH } from './constants';
import {
  FileCategory,
  FileDataObject,
  FileObject,
  ImageInput,
  ImageOutput,
  RemoveImageInput,
  UploadImageInput,
  UploadImageOutput,
} from './graphql';
import { FileDB } from './types';

@Injectable()
export class FileService {
  private readonly imageTableRef: FirebaseTableReference<FileDB>;

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

  private async getImageData(id: string): Promise<FileDB | null> {
    const imageDataSnapshot = await this.imageTableRef.child(id).get();

    return imageDataSnapshot.val();
  }

  private async deleteImageFromDB(id: string): Promise<true> {
    await this.imageTableRef.child(id).remove();

    return true;
  }

  private isImageData(imageData: FileDB | null): imageData is FileDB {
    return Boolean(imageData);
  }

  private isValidRoute(routeChunks?: string[]): routeChunks is string[] {
    return routeChunks !== undefined && routeChunks?.length > IMAGE_PATH_CHUNKS;
  }

  private isStoragePathDefined(storagePath?: string): storagePath is string {
    return storagePath !== undefined;
  }

  async uploadImage(input: UploadImageInput): Promise<UploadImageOutput> {
    const { id, base64, category, subcategory, data } = input;

    const storagePath = path.join(STORAGE_PATH, category, subcategory, id);

    const imageData = {
      ...data,
      storagePath,
    } satisfies FileDataObject;

    try {
      const downloadURL = await this.uploadImageToStorage(base64, storagePath);

      await this.imageTableRef.child(id).child('data').set(imageData);

      const image: FileObject = {
        id,
        category,
        subcategory,
        downloadURL,
        data: imageData,
      };

      return {
        image,
      };
    } catch {
      throw new Error('Uploading image failed');
    }
  }

  async removeImage(input: RemoveImageInput): Promise<true> {
    const { id } = input;

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

  async getImage(input: ImageInput): Promise<ImageOutput> {
    const { id } = input;

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

      const image: FileObject = {
        id,
        category: routeChunks[1] as FileCategory,
        subcategory: routeChunks[2],
        downloadURL,
        data,
      };

      return {
        image,
      };
    } catch {
      throw new Error('Loading image failed');
    }
  }
}
