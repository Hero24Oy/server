import { ObjectType } from '@nestjs/graphql';

import { makePaginationDto } from 'src/modules/common/dto/pagination.dto';

import { ChatDto } from '../chat/chat.dto';

@ObjectType()
export class ChatsDto extends makePaginationDto<ChatDto, ChatDto['id']>(
  'ChatsDto',
  ChatDto,
  String,
) {}
