import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  /* ---------- HTTP requests ---------- */
  if (ctx.getType() === 'http') {
    const req = ctx.switchToHttp().getRequest();
    return req.user ?? null; // set by JwtAuthGuard / passport
  }

  /* ---------- WebSocket (Socket.IO) ---------- */
  if (ctx.getType() === 'ws') {
    const client = ctx.switchToWs().getClient();
    return client.data?.user ?? null; // set in WsJwtGuard / middleware
  }

  /* ---------- (optional) gRPC / other RPC contexts ---------- */
  if (ctx.getType() === 'rpc') {
    const rpcCtx = ctx.switchToRpc().getContext();
    return rpcCtx.user ?? null;
  }

  return null;
});
