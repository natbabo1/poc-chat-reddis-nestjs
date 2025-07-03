import { registerAs } from '@nestjs/config';

export default registerAs('his', () => ({
  jwtPrivateKey: process.env.HIS_JWT_PRIVATE_KEY || 'his-jwt-secret',
}));
