import { NestFactory } from '@nestjs/core';
import { ImageDB } from 'hero24-types';

import { AppModule } from '$/app.module';
import { FileDB } from '$modules/file/types';
import { FirebaseDatabasePath } from '$modules/firebase/firebase.constants';
import { FirebaseService } from '$modules/firebase/firebase.service';
import { FirebaseTableReference } from '$modules/firebase/firebase.types';

const replaceImagesWithFiles = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const firebaseService = app.get<FirebaseService>(FirebaseService);

  const database = firebaseService.getDefaultApp().database();

  const imagesTableRef: FirebaseTableReference<ImageDB> = database.ref(
    FirebaseDatabasePath.IMAGES,
  );

  const filesTableRef: FirebaseTableReference<FileDB> = database.ref(
    FirebaseDatabasePath.FILES,
  );

  const imagesSnapshot = await imagesTableRef.get();
  const images = imagesSnapshot.val();

  if (!images) {
    return;
  }

  try {
    await Promise.all(
      Object.entries(images).map(async ([id, imageData]) => {
        await filesTableRef.child(id).child('data').set(imageData.data);
      }),
    );
  } catch (error) {
    console.error(`There was an error during migration: ${error}`);
  }

  process.exit(0);
};

void replaceImagesWithFiles();