import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatWsService } from "./chat-ws.service";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, ChatWsService],
})
export class ChatModule {}
