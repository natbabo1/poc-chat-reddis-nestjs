import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns **all** users except the one whose id is passed in.
   * Used by the People page so a user can't start a DM with themself.
   */
  async findAllExcept(excludeUserId: string) {
    return this.prisma.user.findMany({
      where: { id: { not: excludeUserId } },
      select: {
        id: true,
        name: true,
        email: true, // include or omit fields as you need
        avatarUrl: true,
      },
      orderBy: { name: "asc" },
    });
  }
}
