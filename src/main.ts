import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ServerConfig, ServerConfigKey } from './infrastructure';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);
  const { host, port } =
    configService.getOrThrow<ServerConfig>(ServerConfigKey);

  await app.listen({ host, port });
}

void bootstrap();
