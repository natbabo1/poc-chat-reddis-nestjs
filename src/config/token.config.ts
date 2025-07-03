import { registerAs } from "@nestjs/config";

export default registerAs("token", () => ({
  jwtPrivateKey: process.env.JWT_SECRET || "jwt-secret",
  jwtExpires: process.env.JWT_EXPIRES || "1h",
}));
