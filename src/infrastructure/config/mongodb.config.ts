import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';
import { validateSchema } from './config.utils';

export interface MongoDBConfig {
  readonly uri: string;
}

interface MongoDBEnv {
  readonly MONGODB_URI: string;
}

export const MongoDBValidationSchema = Joi.object<MongoDBEnv>({
  MONGODB_URI: Joi.string()
    .uri({ scheme: ['mongodb'] })
    .required(),
});

function createMongoDBConfig(): MongoDBConfig {
  const env = validateSchema(MongoDBValidationSchema, process.env);

  return {
    uri: env.MONGODB_URI,
  };
}

export const MongoDBConfigKey = 'mongodb';

export const MongoDBConfigFactory = registerAs(
  MongoDBConfigKey,
  createMongoDBConfig,
);
