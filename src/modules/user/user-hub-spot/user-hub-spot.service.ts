import { Injectable, Logger } from '@nestjs/common';
import { isEqual } from 'lodash';

import { HubSpotContactService } from '../../hub-spot/hub-spot-contact/hub-spot-contact.service';
import {
  HubSpotContactObject,
  HubSpotContactProperties,
} from '../../hub-spot/hub-spot-contact/hub-spot-contact.types';
import { UserDto } from '../dto/user/user.dto';
import { UserService } from '../user.service';

import { HubSpotContactProperty } from '$modules/hub-spot/hub-spot-contact/hub-spot-contact.constants';

@Injectable()
export class UserHubSpotService {
  constructor(
    private hubSpotContactService: HubSpotContactService,
    private userService: UserService,
  ) {}

  private logger = new Logger(UserHubSpotService.name);

  public async upsertContact(
    user: UserDto,
  ): Promise<HubSpotContactObject | null> {
    const properties = this.prepareContactProperties(user);

    try {
      const contact = await this.hubSpotContactService.upsertContact(
        properties,
        user.hubSpotContactId,
      );

      await this.userService.setHubSpotContactId(user.id, contact.id);

      return contact;
    } catch (err) {
      this.logger.error(err);

      return null;
    }
  }

  public async strictUpsertContact(
    user: UserDto,
  ): Promise<HubSpotContactObject> {
    const contact = await this.upsertContact(user);

    if (!contact) {
      throw new Error("Contact couldn't be created or updated");
    }

    return contact;
  }

  public shouldUpdateContact(user: UserDto, previous: UserDto) {
    return !isEqual(
      this.getCompareValues(user),
      this.getCompareValues(previous),
    );
  }

  private prepareContactProperties(user: UserDto): HubSpotContactProperties {
    return {
      [HubSpotContactProperty.EMAIL]: user.data.email,
      [HubSpotContactProperty.FIRST_NAME]: user.data.firstName || '',
      [HubSpotContactProperty.LAST_NAME]: user.data.lastName || '',
      [HubSpotContactProperty.PHONE_NUMBER]: user.data.phone || '',
    };
  }

  private getCompareValues = (compareUser: UserDto) => [
    compareUser.data.email,
    compareUser.data.firstName,
    compareUser.data.lastName,
  ];
}
