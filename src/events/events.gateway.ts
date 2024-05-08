import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Eventsgateway');

  @SubscribeMessage('events')
  handleMessage(@MessageBody() data: string): string {
    return data;
  }

  // 웹소켓 서버가 실행되면 aferInit 함수 실행됨
  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 커넥트 해제 : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`클라이언트 커넥트 연결 : ${client.id}`);
  }
}
