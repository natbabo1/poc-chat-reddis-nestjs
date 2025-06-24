import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
    return this.prisma.message.create({
      data: { senderId, receiverId, content },
    });
  }

  async getLastMessageBetween(userA: number, userB: number): Promise<Message | null> {
    return this.prisma.message.findFirst({
      where: {
        OR: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
