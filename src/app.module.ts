import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './config';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: Config,
    }),
    UsersModule,
    AuthModule,
    ChatModule,
    PrismaModule,
    RedisModule,
  ],
})
export class AppModule {}
