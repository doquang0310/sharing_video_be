import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videos } from './entities/video.entity';
import { createVideoDto } from './dto/video.dto';
import axios from 'axios';
import { InfoVideo } from './video.type';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { VideoGateway } from './video.gateway';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Videos)
    private videoRepository: Repository<Videos>,
    private videoGateway: VideoGateway,
  ) {}

  async create(data: createVideoDto): Promise<Videos> {
    const video = await this.videoRepository.save({
      url: data.url,
      title: data.title,
      description: data.description,
      up_vote: 0,
      down_vote: 0,
      publishedBy : data.publishedBy,
    });

    await this.videoGateway.sendMessage(video);

    return video;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Videos>> {
    const queryBuilder = this.videoRepository
      .createQueryBuilder('videos')
      .leftJoinAndSelect('videos.publishedBy', 'users')
      .orderBy('videos.createdDate', 'DESC');

    return paginate(query, queryBuilder, {
      sortableColumns: ['createdDate'],
      nullSort: 'last',
      searchableColumns: ['title', 'description'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {},
    });
  }

  async getDataFromUrl(id: string): Promise<InfoVideo> {
    const baseUrl = `https://www.googleapis.com/youtube/v3/videos`;
    const response = await axios.get(baseUrl, {
      params: {
        part: 'snippet',
        id: id,
        key: 'AIzaSyCAcltS6dcjUruHJr1yVvwBzWAMdjvYBPw',
      },
    });
    const data = response.data.items[0].snippet;

    return {
      title: data.title,
      description: data.description,
      url: `https://www.youtube.com/embed/${id}`,
    };
  }

  async getIdFromUrl(url: string) {
    const result =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(result) ? RegExp.$1 : false;
  }
}
