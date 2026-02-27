import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';
import { validateSchema } from './config.utils';

export interface RedisConfig {
  readonly url: string;
}

interface RedisEnv {
  readonly REDIS_URL: string;
}

export const RedisValidationSchema = Joi.object<RedisEnv>({
  REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .required(),
});

function createRedisConfig(): RedisConfig {
  const env = validateSchema(RedisValidationSchema, process.env);

  return {
    url: env.REDIS_URL,
  };
}

export const RedisConfigKey = 'redis';

export const RedisConfigFactory = registerAs(RedisConfigKey, createRedisConfig);
