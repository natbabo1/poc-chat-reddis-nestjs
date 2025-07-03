import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { AppJwtGuard } from 'src/guards/app-jwt.guard';
import { AppTokenPayload } from 'src/auth/token.service';

@Controller('chat')
@UseGuards(AppJwtGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
  ) {}

  @Get('people')
  async list(@CurrentUser() me: AppTokenPayload) {
    console.log(me);
    return this.usersService.findAllExcept(me.id);
  }

  @Post('rooms/private')
  async open(@Body() dto: { targetUserId: string }, @CurrentUser() me: AppTokenPayload) {
    const room = await this.chatService.getOrCreatePrivateRoom(me.id, dto.targetUserId);
    return { roomId: room.id };
  }
}
