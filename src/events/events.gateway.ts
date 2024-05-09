import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit {
  constructor() {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Eventsgateway');

  @SubscribeMessage('events')
  handleMessage(@MessageBody() data: string): void {
    console.log(data);

    this.server.emit('events', data);
  }

  @SubscribeMessage('getId')
  handleEvent(@MessageBody('id') id: number): number {
    console.log(id);

    return id;
  }

  // 웹소켓 서버가 실행되면 aferInit 함수 실행됨
  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }
}
