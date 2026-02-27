import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';
import { validateSchema } from './config.utils';

export interface ServerConfig {
  readonly host: string;
  readonly port: number;
}

interface ServerEnv {
  readonly HOST: string;
  readonly PORT: number;
}

export const ServerValidationSchema = Joi.object<ServerEnv>({
  HOST: Joi.string().hostname().allow('0.0.0.0', 'localhost').required(),
  PORT: Joi.number().port().required(),
});

function createServerConfig(): ServerConfig {
  const env = validateSchema(ServerValidationSchema, process.env);

  return {
    host: env.HOST,
    port: env.PORT,
  };
}

export const ServerConfigKey = 'server';

export const ServerConfigFactory = registerAs(
  ServerConfigKey,
  createServerConfig,
);
