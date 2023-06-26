import { ObjectType } from '@nestjs/graphql';

import { Paginated } from 'src/modules/common/dto/pagination.dto';

import { ChatDto } from '../chat/chat.dto';

@ObjectType()
export class ChatListDto extends Paginated(ChatDto) {}
