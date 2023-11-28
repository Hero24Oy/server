import { Injectable } from '@nestjs/common';
import { getDownloadURL } from 'firebase-admin/storage';
import { File } from 'hero24-types';
import path from 'path';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';

import { FILE_PATH_CHUNKS } from './constants';
import {
  FileCategory,
  FileDataObject,
  FileObject,
  FileOutput,
  MimeType,
  UploadFileInput,
  UploadFileOutput,
} from './graphql';
import {
  ErrorMessage,
  FileWithStoragePath,
  FirebaseMetadata,
  UploadFileToStorageArgs,
} from './types';
import { getStoragePathFolder } from './utils';

@Injectable()
export class FileService {
  private readonly fileTableRef: FirebaseTableReference<File>;

  constructor(private readonly firebaseService: FirebaseService) {
    const database = firebaseService.getDefaultApp().database();

    this.fileTableRef = database.ref(FirebaseDatabasePath.FILES);
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

  private async getMimeType(storagePath: string): Promise<MimeType> {
    const storage = this.firebaseService.getStorage().bucket();

    const response = await storage.file(storagePath).getMetadata();

    const { contentType } = response.at(0) as FirebaseMetadata;

    return contentType;
  }

  private isFileData(fileData: File | null): fileData is File {
    return Boolean(fileData);
  }

  private isValidRoute(routeChunks?: string[]): routeChunks is string[] {
    return routeChunks !== undefined && routeChunks?.length > FILE_PATH_CHUNKS;
  }

  private isStoragePathDefined(storagePath?: string): storagePath is string {
    return storagePath !== undefined;
  }

  private async strictGetFileDataById(
    id: string,
  ): Promise<FileWithStoragePath> {
    const fileDataSnapshot = await this.fileTableRef.child(id).get();
    const fileData = fileDataSnapshot.val();

    if (!this.isFileData(fileData)) {
      throw new Error(ErrorMessage.NO_FILE_DATA);
    }

    if (!this.isStoragePathDefined(fileData.data.storagePath)) {
      throw new Error(ErrorMessage.INVALID_STORAGE_PATH);
    }

    return fileData as FileWithStoragePath;
  }

  private strictGetRouteChunks(storagePath?: string): string[] {
    const routeChunks = storagePath?.split('/');

    if (!this.isValidRoute(routeChunks)) {
      throw new Error(ErrorMessage.INVALID_STORAGE_PATH);
    }

    return routeChunks;
  }

  private async deleteFileFromDB(id: string): Promise<true> {
    await this.fileTableRef.child(id).remove();

    return true;
  }

  async uploadFile(input: UploadFileInput): Promise<UploadFileOutput> {
    const { id, mime, base64, category, subcategory, data } = input;

    const storagePathFolder = getStoragePathFolder(mime);

    const storagePath = path.join(storagePathFolder, category, subcategory, id);

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

      const internalFileData = FileDataObject.adapter.toInternal(fileData);

      await this.fileTableRef.child(id).child('data').set(internalFileData);

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
      throw new Error(ErrorMessage.UPLOADING_FAILED);
    }
  }

  async removeFileById(id: string): Promise<true> {
    const fileData = await this.strictGetFileDataById(id);

    try {
      const { storagePath } = fileData.data;

      await Promise.all([
        this.deleteFileFromStorage(storagePath),
        this.deleteFileFromDB(id),
      ]);
    } catch {
      throw new Error(ErrorMessage.DELETION_FAILED);
    }

    return true;
  }

  async getFileById(id: string): Promise<FileOutput> {
    const fileData = await this.strictGetFileDataById(id);
    const routeChunks = this.strictGetRouteChunks(fileData?.data.storagePath);

    try {
      const { data } = fileData;
      const { storagePath } = fileData.data;

      const mime = await this.getMimeType(storagePath);

      const downloadURL = await this.getStorageFileUrl(storagePath);

      const file: FileObject = {
        id,
        category: routeChunks[1] as FileCategory,
        subcategory: routeChunks[2],
        downloadURL,
        mime,
        data,
      };

      return {
        file,
      };
    } catch {
      throw new Error(ErrorMessage.LOADING_FAILED);
    }
  }
}
