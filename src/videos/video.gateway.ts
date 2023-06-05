import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Videos } from './entities/video.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VideoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  private logger: Logger = new Logger('VideoGateway');

  @WebSocketServer() wss: Server;

  afterInit() {
    this.logger.log(`Server Initialized`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  @SubscribeMessage('videos')
  async sendMessage(payload: Videos): Promise<void> {
    console.log(payload)
    this.wss.emit('videos', payload);
  }
}
