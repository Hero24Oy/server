import { UseFilters } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { FirebaseApp } from '../firebase/firebase.decorator';
import { FirebaseAppInstance } from '../firebase/firebase.types';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { SettingsDto } from './dto/settings/settings.dto';
import { SettingsService } from './settings.service';

@Resolver()
export class SettingsResolver {
  constructor(private SettingsService: SettingsService) {}

  @Query(() => SettingsDto, { nullable: true })
  @UseFilters(FirebaseExceptionFilter)
  async settings(
    @FirebaseApp() app: FirebaseAppInstance,
  ): Promise<SettingsDto | null> {
    return this.SettingsService.getSettings(app);
  }
}
