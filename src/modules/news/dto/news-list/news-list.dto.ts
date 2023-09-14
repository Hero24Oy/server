import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/modules/common/dto/pagination.dto';

import { NewsDto } from '../news/news.dto';

@ObjectType()
export class NewsListDto extends Paginated(NewsDto) {}
