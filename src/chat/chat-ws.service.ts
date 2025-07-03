import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './chat.dto';

@Injectable()
export class ChatWsService {
  constructor(private prisma: PrismaService) {}

  /* ---------- membership ---------- */

  /** returns true if user already in room */
  async addMember(userId: string, roomId: string) {
    await this.prisma.roomMember.upsert({
      where: { roomId_userId: { roomId, userId } },
      update: {},
      create: { roomId, userId },
    });
  }

  async getRoomsForUser(userId: string) {
    return this.prisma.room.findMany({
      where: { members: { some: { userId } } },
      include: { lastMessage: true },
    });
  }

  /* ---------- messages ---------- */

  async createMessage(senderId: string, dto: SendMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        roomId: dto.roomId,
        senderId,
        type: dto.type,
        content: dto.type === 'TEXT' ? { text: dto.text } : { fileMeta: dto.fileMeta },
      },
    });

    // update pointer for "last message"
    await this.prisma.room.update({
      where: { id: dto.roomId },
      data: { lastMessageId: message.id },
    });

    return message;
  }

  async getHistory(roomId: string, cursor?: string, limit = 50) {
    return this.prisma.message.findMany({
      where: { roomId },
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
    });
  }
}
