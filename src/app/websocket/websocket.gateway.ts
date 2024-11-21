import {

  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { SendMessageDto } from '../chat/chat.dto';

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: '*', // ubah kedomain spesifik jika perlu
  },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_message')
  sendMessage(@MessageBody() body: SendMessageDto) {

    this.server.to(body.room_receiver).emit('received_message', {
      msg: 'new Message',
      data: body,
    });
  }
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('room_code') room_code: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('join', room_code);
    client.join(room_code);
    this.server.emit('join.reply', {
      message: `You have joined room`,
    });
  }
  async create(payload: SendMessageDto) {
    this.server.to(payload.room_sender).emit('received_message', payload);
    this.server.to(payload.room_receiver).emit('received_message', payload);
  }
  @SubscribeMessage('typing')
  Typing(@MessageBody() payload: { sender: string; receiver: string, is_typing: boolean }) {

    console.log('oay', payload)
    this.server.to(payload.receiver).emit('typing.listen', payload);
  }
}