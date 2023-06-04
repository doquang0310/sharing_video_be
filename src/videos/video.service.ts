import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoEntity } from './entities/video.entity';
import { createVideoDto } from './dto/video.dto';
import axios from 'axios';
import { InfoVideo } from './video.type';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,
  ) {}

  async createVideo(data: createVideoDto): Promise<VideoEntity> {
    const video = this.videoRepository.create({
      url: data.url,
      title: data.title,
      description: data.description,
      up_vote: 0,
      down_vote: 0,
    });

    return video;
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
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  async getIdFromUrl(url: string) {
    const result =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(result) ? RegExp.$1 : false;
  }
}