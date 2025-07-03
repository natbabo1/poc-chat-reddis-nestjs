import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { AppTokenPayload } from 'src/auth/token.service';

@Injectable()
export class AppJwtGuard implements CanActivate {
  private secret = process.env.JWT_SECRET;

  canActivate(ctx: ExecutionContext) {
    // ---------- HTTP ----------
    if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest();
      const token = req.headers.authorization?.split(' ')[1];
      return this.attach(token, user => (req.user = user));
    }

    // ---------- WebSocket ----------
    const client = ctx.switchToWs().getClient<Socket>();
    return this.attach(client.handshake.auth?.token, user => (client.data.user = user));
  }

  private attach(raw: string | undefined, inject: (u: AppTokenPayload) => void) {
    if (!raw) return false;
    try {
      const user = jwt.verify(raw, this.secret) as AppTokenPayload;
      inject(user);
      return true;
    } catch {
      return false;
    }
  }
}
