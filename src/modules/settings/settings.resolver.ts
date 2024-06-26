import { UseFilters } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { FirebaseAppInstance } from '../firebase/firebase.types';

import { SettingsDto } from './dto/settings/settings.dto';
import { SettingsService } from './settings.service';

@Resolver()
export class SettingsResolver {
  constructor(private settingsService: SettingsService) {}

  @Query(() => SettingsDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  async settings(
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<SettingsDto | null> {
    return this.settingsService.getSettings(app);
  }
}
