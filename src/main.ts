import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { ServerConfig } from './infrastructure';
import { ConfigService } from '@nestjs/config';
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
  const { host, port } = configService.getOrThrow<ServerConfig>('server');

  await app.listen({ host, port });
}

void bootstrap();
