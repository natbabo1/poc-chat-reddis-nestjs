import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';

@Module({ controllers: [AuthController], providers: [TokenService] })
export class AuthModule {}
