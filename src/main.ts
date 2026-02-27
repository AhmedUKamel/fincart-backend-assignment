import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { ServerConfig, ServerConfigKey } from './infrastructure';
import { AppExceptionFilter, AppValidationPipe } from './modules/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(new AppValidationPipe());
  app.useGlobalFilters(new AppExceptionFilter());

  const configService = app.get(ConfigService);
  const { host, port } =
    configService.getOrThrow<ServerConfig>(ServerConfigKey);

  await app.listen({ host, port });
}

void bootstrap();
