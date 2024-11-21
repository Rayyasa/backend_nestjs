import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponsePreviosMessage, ResponseSuccess } from 'src/interface';
import BaseResponse from 'src/utils/response/base.response';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Message } from './message.entity';
import { MessageGateway } from '../websocket/websocket.gateway';
import { PreviosMessageDto, SendMessageDto } from './chat.dto';

@Injectable()
export class ChatService extends BaseResponse {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly webService: MessageGateway,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async generateConversationId(user2: number): Promise<ResponseSuccess> {
    let user1 = this.req.user.id;

    const code = await this.conversationRepository.findOne({
      where: [
        {
          user1: {
            id: user1,
          },
          user2: {
            id: user2,
          },
        },
        {
          user1: {
            id: user2,
          },
          user2: {
            id: user1,
          },
        },
      ],
    });



    if (code === null) {
      const result = await this.conversationRepository.save({
        user1: {
          id: user1,
        },
        user2: {
          id: user2,
        },
      });

      return this._Success('OK', {
        conversation_id: result.id,
        user1,
        user2,
      });
    }

    return this._Success('OK', {
      conversation_id: code.id,
      user1,
      user2,
    });
  }

  async create(payload: SendMessageDto) {
    const result = await this.messageRepository.save({
      ...payload,
      sender: { id: this.req.user.id },
      is_read: 0,
    });
    this.webService.create({
      ...result,
      room_receiver: payload.room_receiver,
      room_sender: this.req.user.email,
    });

    return this._Success('OK');
  }
  async list(): Promise<ResponseSuccess> {
    // Ambil semua percakapan berdasarkan pengguna
    const conversations = await this.conversationRepository.find({
      where: [
        { user1: { id: this.req.user.id } },
        { user2: { id: this.req.user.id } },
      ],
      relations: ['user1', 'user2'], // Hanya ambil relasi user1 dan user2
      select: {
        user1: { id: true, nama: true, email: true },
        user2: { id: true, nama: true, email: true },
      },
    });

    // Ambil pesan terbaru untuk setiap percakapan
    const conversationsWithLatestMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const messages = await this.messageRepository
          .createQueryBuilder('message')
          .leftJoin('message.sender', 'sender') // Gabungkan data sender
          .leftJoin('message.receiver', 'receiver') // Gabungkan data receiver
          .addSelect(['sender.id', 'receiver.id']) // Pilih hanya id sender dan receiver
          .where('message.conversation_id = :conversationId', {
            conversationId: conversation.id,
          })
          .orderBy('message.created_at', 'DESC') // Urutkan dari yang terbaru
          .limit(20) // Batasi hanya 10 pesan terakhir
          .getMany();

        // Ambil pesan terbaru
        const latestMessage = messages[0] || null;
        const totalMessages = await this.messageRepository
          .createQueryBuilder('message')
          .where('message.conversation_id = :conversationId', {
            conversationId: conversation.id,
          })
          .getCount();

        return {
          ...conversation,
          messages,
          conversation_id: conversation.id,
          latestMessage,
          totalMessages,
          limit: 0,
          pageSize: 10
        };
      }),
    );

    // Urutkan percakapan berdasarkan tanggal pesan terbaru (jika ada)
    const sortedConversations = conversationsWithLatestMessage.sort((a, b) => {
      const latestMessageA = a.latestMessage?.created_at || new Date(0);
      const latestMessageB = b.latestMessage?.created_at || new Date(0);
      return latestMessageB.getTime() - latestMessageA.getTime(); // Urutkan dari yang terbaru
    });

    return this._Success('OK', sortedConversations);
  }
  async getPreviosMessage(
    payload: PreviosMessageDto,
  ): Promise<ResponsePreviosMessage> {
    const previosMessage = await this.messageRepository.find({
      relations: ['sender', 'receiver'],
      select: {
        sender: { id: true },
        receiver: { id: true },
      },
      where: {
        conversation_id: {
          id: payload.conversation_id,
        },
      },
      skip: payload.limit,
      take: payload.pageSize,
      order: {
        id: 'DESC',
      },
    });

    return this._prevMessage(payload.conversation_id, previosMessage);
  }
}