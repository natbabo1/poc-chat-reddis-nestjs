import { Injectable, OnModuleInit, INestApplication } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Recent Prisma versions type `$on` generically, which can cause the
    // "beforeExit" event to be inferred as `never`. Casting `this` to `any`
    // avoids the compilation error while keeping the intended behavior.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$on("beforeExit", async () => {
      await app.close();
    });
  }
}
