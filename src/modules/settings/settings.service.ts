import { Injectable } from '@nestjs/common';
import { get, getDatabase, ref } from 'firebase/database';

import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseAppInstance } from '../firebase/firebase.types';

import { SettingsDto } from './dto/settings/settings.dto';
import { Settings } from './settings.types';

@Injectable()
export class SettingsService {
  async getSettings(app: FirebaseAppInstance): Promise<SettingsDto | null> {
    const database = getDatabase(app);

    const settingsSnapshot = await get(
      ref(database, `${FirebaseDatabasePath.SETTINGS}`),
    );

    const settings: Settings | null = settingsSnapshot.val(); // Todo: add settings adapter

    return settings;
  }
}
