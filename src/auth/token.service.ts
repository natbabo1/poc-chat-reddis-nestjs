import * as jwt from "jsonwebtoken";
import { Inject, Injectable } from "@nestjs/common";
import hisConfig from "src/config/his.config";
import { ConfigType } from "@nestjs/config";
import tokenConfig from "src/config/token.config";
import type { StringValue } from "ms";

export interface HisPayload {
  sub: string;
  email: string;
  name?: string;
  // …anything else the upstream system puts in the token
}

@Injectable()
export class TokenService {
  private readonly hisSecretKey: string;
  private readonly appJwtSecretKey: string;
  private readonly appJwtExpires: StringValue;

  constructor(
    @Inject(hisConfig.KEY) hisConf: ConfigType<typeof hisConfig>,
    @Inject(tokenConfig.KEY) tokenConf: ConfigType<typeof tokenConfig>,
  ) {
    this.hisSecretKey = hisConf.jwtPrivateKey;
    this.appJwtSecretKey = tokenConf.jwtPrivateKey;
    this.appJwtExpires = tokenConf.jwtExpires as StringValue;
  }

  verifyHis(token: string): HisPayload {
    return jwt.verify(token, this.hisSecretKey) as HisPayload;
  }

  issueAppToken(user: HisPayload) {
    return jwt.sign(
      { id: user.sub, email: user.email, name: user.name },
      this.appJwtSecretKey,
      { expiresIn: this.appJwtExpires },
    );
  }
}
