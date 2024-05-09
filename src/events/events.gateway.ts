import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Eventsgateway');

  @SubscribeMessage('events')
  handleMessage(@MessageBody() data: string): void {
    this.server.emit('events', data);
  }

  @SubscribeMessage('getId')
  handleEvent(@MessageBody('id') id: number): number {
    return id;
  }

  handleDisconnect(client: any) {
    console.log('채팅 끊어짐');
  }

  // 웹소켓 서버가 실행되면 aferInit 함수 실행됨
  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }
}
