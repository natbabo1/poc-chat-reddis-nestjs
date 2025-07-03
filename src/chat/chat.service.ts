// src/chat/chat.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get the private room between two users, or create it atomically. */
  async getOrCreatePrivateRoom(userA: string, userB: string) {
    if (userA === userB) {
      throw new BadRequestException('Cannot create private chat with yourself');
    }

    /* 1. Create deterministic pairKey ("smaller#larger") */
    const [first, second] = userA < userB ? [userA, userB] : [userB, userA];
    const pairKey = `${first}#${second}`;

    /* 2. Try fast path first */
    const existing = await this.prisma.room.findUnique({
      where: { pairKey },
    });
    if (existing) return existing;

    /* 3. Create inside a transaction to avoid race conditions */
    return this.prisma.$transaction(async tx => {
      // Somebody else might have created it a millisecond ago
      const again = await tx.room.findUnique({ where: { pairKey } });
      if (again) return again;

      return tx.room.create({
        data: {
          type: 'ONE_TO_ONE',
          pairKey,
          members: {
            createMany: {
              data: [{ userId: userA }, { userId: userB }],
            },
          },
        },
      });
    });
  }
}
