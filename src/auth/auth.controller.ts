import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { TokenService } from "./token.service";
import { AppJwtGuard } from "src/guards/app-jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly tokens: TokenService) {}

  @Post("exchange")
  exchange(@Body("extToken") extToken?: string) {
    if (!extToken) throw new BadRequestException("extToken missing");

    const hisUser = this.tokens.verifyHis(extToken);
    // TODO: Optionally look up / create user in DB here

    console.log(hisUser);

    const appToken = this.tokens.issueAppToken(hisUser);
    return { appToken };
  }
}
