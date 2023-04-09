import { Injectable } from '@nestjs/common';
import { FirebaseAppInstance } from './firebase.types';

@Injectable()
export class FirebaseAppService {
  private userAppConnectionController: Map<string, number> = new Map();

  private authorizedAppPromises: Map<string, Promise<FirebaseAppInstance>> =
    new Map();

  private deletingAppPromises: Map<string, Promise<void>> = new Map();

  addAppConnection(appName: string) {
    if (!this.userAppConnectionController.has(appName)) {
      this.userAppConnectionController.set(appName, 0);
    }

    const previousConnectionCount = this.userAppConnectionController.get(
      appName,
    ) as number;
    const updatedConnectionCount = previousConnectionCount + 1;

    this.userAppConnectionController.set(appName, updatedConnectionCount);
  }

  removeAppConnection(appName: string) {
    if (!this.userAppConnectionController.has(appName)) {
      throw new Error(
        `App connection controller flow was corrupted. App ${appName} isn't existed`,
      );
    }

    const previousConnectionCount = this.userAppConnectionController.get(
      appName,
    ) as number;
    const updatedConnectionCount = previousConnectionCount - 1;

    if (updatedConnectionCount === 0) {
      this.userAppConnectionController.delete(appName);
    }

    if (updatedConnectionCount !== 0) {
      this.userAppConnectionController.set(appName, updatedConnectionCount);
    }

    return updatedConnectionCount;
  }

  async lockDeleting(
    appName: string,
    executor: (resolve: () => void) => Promise<void>,
  ) {
    const deletingPromise = new Promise<void>((resolve) => {
      executor(() => {
        resolve();
        this.deletingAppPromises.delete(appName);
      });
    });

    this.authorizedAppPromises.delete(appName);
    this.deletingAppPromises.set(appName, deletingPromise);

    return deletingPromise;
  }

  isDeleting(appName: string) {
    return this.deletingAppPromises.has(appName);
  }

  async waitDeleting(appName: string) {
    return this.deletingAppPromises.get(appName);
  }

  isAuthorized(appName: string) {
    return this.authorizedAppPromises.has(appName);
  }

  lockAuthorizing(
    appName: string,
    executor: (resolve: (app: FirebaseAppInstance) => void) => Promise<void>,
  ) {
    const authorizedAppPromise = new Promise<FirebaseAppInstance>(executor);

    this.authorizedAppPromises.set(appName, authorizedAppPromise);
  }

  async waitAuthorizing(appName: string) {
    return this.authorizedAppPromises.get(appName);
  }
}
