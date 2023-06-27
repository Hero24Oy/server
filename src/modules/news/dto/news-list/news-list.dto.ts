import { Paginated } from 'src/modules/common/dto/pagination.dto';
import { NewsDto } from '../news/news.dto';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NewsListDto extends Paginated(NewsDto) {}
