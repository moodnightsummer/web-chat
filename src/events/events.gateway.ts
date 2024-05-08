import { Socket, Server } from 'socket.io';
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

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Eventsgateway');

  connectedClients: { [socketId: string]: boolean } = {};
  clientNickname: { [socketId: string]: string } = {};
  roomUsers: { [key: string]: string[] } = {};

  @SubscribeMessage('events')
  handleMessage(@MessageBody() data: string): string {
    return data;
  }

  // 웹소켓 서버가 실행되면 aferInit 함수 실행됨
  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }

  handleDisconnect(client: Socket) {
    // 클라이언트 종료하고자 하는 클라이언트 id로 종료
    delete this.connectedClients[client.id];

    Object.keys(this.roomUsers).forEach((room) => {
      const index = this.roomUsers[room]?.indexOf(
        this.clientNickname[client.id],
      );
      if (index !== -1) {
        this.roomUsers[room].splice(index, 1);
        this.server
          .to(room)
          .emit('userList', { room, userList: this.roomUsers[room] });
      }
    });

    // 모든 방의 유저 목록을 업데이트 후 emit
    Object.keys(this.roomUsers).forEach((room) => {
      this.server
        .to(room)
        .emit('userList', { room, userList: this.roomUsers[room] });
    });

    console.log(this.roomUsers);

    // 연결된 클라이언트 목록을 업데이트 후 emit
    this.server.emit('userList', {
      room: null,
      userList: Object.keys(this.connectedClients),
    });
  }

  handleConnection(client: Socket) {
    // 이미 연결된 클라이언트인지 확인
    if (this.connectedClients[client.id]) {
      // 연결돼 있던 클라이언트 연결 해제
      client.disconnect(true);
      return;
    }

    this.connectedClients[client.id] = true;
  }
}
