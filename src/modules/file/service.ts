import { Injectable } from '@nestjs/common';
import { getDownloadURL } from 'firebase-admin/storage';
import path from 'path';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { FILE_PATH_CHUNKS, STORAGE_PATH } from './constants';
import {
  FileCategory,
  FileDataObject,
  FileObject,
  FileOutput,
  MimeType,
  RemoveFileInput,
  UploadFileInput,
  UploadFileOutput,
} from './graphql';
import { FileDB, FirebaseMetadata, UploadFileToStorageArgs } from './types';

@Injectable()
export class FileService {
  private readonly fileTableRef: FirebaseTableReference<FileDB>;

  constructor(private readonly firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.fileTableRef = database.ref(FirebaseDatabasePath.IMAGES);
  }

  private async uploadFileToStorage(
    args: UploadFileToStorageArgs,
  ): Promise<string> {
    const { base64, mime, storagePath } = args;

    const bucket = this.firebaseService.getStorage().bucket();

    const fileData = Buffer.from(base64, 'base64');

    const file = bucket.file(storagePath);

    await file.save(fileData, {
      metadata: {
        contentType: mime,
      },
    });

    return getDownloadURL(file);
  }

  private async deleteFileFromStorage(storagePath: string): Promise<void> {
    const bucket = this.firebaseService.getStorage().bucket();

    const file = bucket.file(storagePath);

    await file.delete();
  }

  private async getStorageFileUrl(storagePath: string): Promise<string> {
    const storage = this.firebaseService.getStorage().bucket();

    return getDownloadURL(storage.file(storagePath));
  }

  private getMimeType(storagePath: string): MimeType | undefined {
    const storage = this.firebaseService.getStorage().bucket();

    const metadata = storage.file(storagePath).metadata as FirebaseMetadata;

    return metadata?.contentType;
  }

  private async getFileData(id: string): Promise<FileDB | null> {
    const fileDataSnapshot = await this.fileTableRef.child(id).get();

    return fileDataSnapshot.val();
  }

  private async deleteFileFromDB(id: string): Promise<true> {
    await this.fileTableRef.child(id).remove();

    return true;
  }

  private isFileData(fileData: FileDB | null): fileData is FileDB {
    return Boolean(fileData);
  }

  private isValidRoute(routeChunks?: string[]): routeChunks is string[] {
    return routeChunks !== undefined && routeChunks?.length > FILE_PATH_CHUNKS;
  }

  private isStoragePathDefined(storagePath?: string): storagePath is string {
    return storagePath !== undefined;
  }

  async uploadFile(input: UploadFileInput): Promise<UploadFileOutput> {
    const { id, mime, base64, category, subcategory, data } = input;

    const storagePath = path.join(STORAGE_PATH, category, subcategory, id);

    const fileData = {
      ...data,
      storagePath,
    } satisfies FileDataObject;

    try {
      const downloadURL = await this.uploadFileToStorage({
        base64,
        storagePath,
        mime,
      });

      await this.fileTableRef.child(id).child('data').set(fileData);

      const file: FileObject = {
        id,
        mime,
        category,
        subcategory,
        downloadURL,
        data: fileData,
      };

      return {
        file,
      };
    } catch {
      throw new Error('Uploading file failed');
    }
  }

  async removeFile(input: RemoveFileInput): Promise<true> {
    const { id } = input;

    const fileData = await this.getFileData(id);

    const routeChunks = fileData?.data.storagePath?.split('/');

    if (
      !this.isFileData(fileData) ||
      !this.isValidRoute(routeChunks) ||
      !this.isStoragePathDefined(fileData.data.storagePath)
    ) {
      throw new Error('File deletion failed');
    }

    try {
      const { storagePath } = fileData.data;

      await Promise.all([
        this.deleteFileFromStorage(storagePath),
        this.deleteFileFromDB(id),
      ]);
    } catch {
      throw new Error('File deletion failed');
    }

    return true;
  }

  async getFile(id: string): Promise<FileOutput> {
    const fileData = await this.getFileData(id);

    const routeChunks = fileData?.data.storagePath?.split('/');

    if (
      !this.isFileData(fileData) ||
      !this.isValidRoute(routeChunks) ||
      !this.isStoragePathDefined(fileData.data.storagePath)
    ) {
      throw new Error('Loading file failed');
    }

    try {
      const { data } = fileData;
      const { storagePath } = fileData.data;

      const mime = this.getMimeType(storagePath);
      const downloadURL = await this.getStorageFileUrl(storagePath);

      const file: FileObject = {
        id,
        category: routeChunks[1] as FileCategory,
        subcategory: routeChunks[2],
        downloadURL,
        mime: mime ?? MimeType.JPG,
        data,
      };

      return {
        file,
      };
    } catch {
      throw new Error('Loading file failed');
    }
  }
}
