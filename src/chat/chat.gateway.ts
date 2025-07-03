import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
} from "@nestjs/websockets";
import { ChatWsService } from "./chat-ws.service";
import { Server, Socket } from "socket.io";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import { SendMessageDto } from "./chat.dto";
import { WsJwtGuard } from "src/guards/ws-jwt.guard";
import * as jwt from "jsonwebtoken";
import tokenConfig from "src/config/token.config";
import { ConfigType } from "@nestjs/config";

@WebSocketGateway({ namespace: "chat" })
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly log = new Logger(ChatGateway.name);
  private readonly appJwtSecretKey: string;

  @WebSocketServer() server: Server;

  constructor(
    @Inject(tokenConfig.KEY) tokenConf: ConfigType<typeof tokenConfig>,
    private readonly chat: ChatWsService
  ) {
    this.appJwtSecretKey = tokenConf.jwtPrivateKey;
  }

  /* ---------- lifecycle ---------- */

  afterInit() {
    // runs once when the gateway boots
    this.server.use((socket: Socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));

      try {
        socket.data.user = jwt.verify(token, this.appJwtSecretKey!);
        next();
      } catch {
        next(new Error("Invalid token"));
      }
    });
  }

  async handleConnection(client: Socket) {
    const { user } = client.data; // set by guard
    this.log.debug(`+ ${user?.id} ${client.id}`);

    // auto-join all rooms you’re a member of
    const rooms = await this.chat.getRoomsForUser(user.id);
    rooms.forEach((r) => client.join(r.id));
    client.emit("rooms", rooms); // send list on connect
  }

  handleDisconnect(client: Socket) {
    const { user } = client.data;
    this.log.debug(`- ${user?.id ?? "anon"} ${client.id}`);
  }

  /* ---------- events ---------- */

  @SubscribeMessage("join")
  async onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string
  ) {
    await this.chat.addMember(client.data.user.id, roomId);
    client.join(roomId);
    this.server.to(roomId).emit("system", `${client.data.user.id} joined`);
  }

  @SubscribeMessage("send")
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto
  ) {
    if (dto.type === "TEXT" && !dto.text?.trim()) {
      throw new WsException("Empty text");
    }
    const msg = await this.chat.createMessage(client.data.user.id, dto);
    this.server.to(dto.roomId).emit("message", msg); // broadcast
    return msg; // ACK to sender
  }

  @SubscribeMessage("history")
  async onHistory(
    @ConnectedSocket() _client: Socket,
    @MessageBody()
    {
      roomId,
      cursor,
      limit,
    }: { roomId: string; cursor?: string; limit?: number }
  ) {
    return this.chat.getHistory(roomId, cursor, limit);
  }
}
