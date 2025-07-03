// auth/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";

@Injectable()
export class WsJwtGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const client = ctx.switchToWs().getClient<Socket>();
    const token: string | undefined = client.handshake.auth?.token;

    if (!token) return false;

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      client.data.user = payload;

      return client.data.user?.id;
    } catch {
      return false;
    }
  }
}
