import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message, Group } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
    return this.prisma.message.create({
      data: { senderId, receiverId, content },
    });
  }

  async createGroup(name: string, memberIds: number[]): Promise<Group> {
    return this.prisma.group.create({
      data: {
        name,
        members: {
          create: memberIds.map((userId) => ({ userId })),
        },
      },
    });
  }

  async addMember(groupId: number, userId: number): Promise<Group> {
    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          create: { userId },
        },
      },
    });
  }

  async createGroupMessage(senderId: number, groupId: number, content: string): Promise<Message> {
    return this.prisma.message.create({
      data: { senderId, groupId, content },
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
