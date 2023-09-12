import { ObjectType } from '@nestjs/graphql';

import { ChatDto } from '../chat/chat.dto';

import { Paginated } from '$/src/modules/common/dto/pagination.dto';

@ObjectType()
export class ChatListDto extends Paginated(ChatDto) {}
