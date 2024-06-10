import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5500/test.html'],
    credentials: true,
    transports: ['websocket', 'polling'],
    secure: true,
    method: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class SocketGateWay {
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  afterInit(socket: Socket) {}

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization;
    const token = this.extractTokenFromHeader(authHeader);

    if (!token) {
      console.log('UnauthorizedException');
    }
    try {
      // verify jwt token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      console.log(`Client ${payload?.email} connect successfully`);
    } catch (err) {
      client.disconnect();
      console.log('UnauthorizedException');
    }
  }
  private extractTokenFromHeader(authHeader: string): string | undefined {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): string {
    console.log(data);
    return data;
  }
}
