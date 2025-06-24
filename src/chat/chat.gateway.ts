import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: { senderId: number; receiverId: number; content: string }) {
    const message = await this.chatService.createMessage(data.senderId, data.receiverId, data.content);
    this.server.emit(`message_${data.receiverId}`, message);
  }
}
