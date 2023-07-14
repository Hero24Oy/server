import { Injectable, Logger } from '@nestjs/common';
import { isEqual } from 'lodash';

import { HubSpotContactProperties } from '../../hub-spot/hub-spot-contact/hub-spot-contact.types';
import { HubSpotContactService } from '../../hub-spot/hub-spot-contact/hub-spot-contact.service';
import { UserDto } from '../dto/user/user.dto';
import { UserService } from '../user.service';

@Injectable()
export class UserHubSpotService {
  constructor(
    private hubSpotContactService: HubSpotContactService,
    private userService: UserService,
  ) {}

  private logger = new Logger(UserHubSpotService.name);

  public async upsertContact(user: UserDto): Promise<void> {
    const properties: HubSpotContactProperties = {
      email: user.data.email,
      firstname: user.data.firstName || '',
      lastname: user.data.lastName || '',
    };

    try {
      const contact = await this.hubSpotContactService.upsertContact(
        properties,
        user.hubSpotContactId,
      );

      await this.userService.setHubSpotContactId(user.id, contact.id);
    } catch (err) {
      this.logger.error(err);
    }
  }

  public shouldUpdateContact(user: UserDto, previous: UserDto) {
    return !isEqual(
      this.getCompareValues(user),
      this.getCompareValues(previous),
    );
  }

  private getCompareValues = (compareUser: UserDto) => [
    compareUser.data.email,
    compareUser.data.firstName,
    compareUser.data.lastName,
  ];
}
