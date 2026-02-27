import * as Joi from 'joi';
import { HmacConfigFactory, HmacValidationSchema } from './hmac.config';
import { RedisConfigFactory, RedisValidationSchema } from './redis.config';
import { ServerConfigFactory, ServerValidationSchema } from './server.config';
import { ConfigModuleOptions as IConfigModuleOptions } from '@nestjs/config';
import {
  MongoDBConfigFactory,
  MongoDBValidationSchema,
} from './mongodb.config';

export class ConfigModuleOptions implements IConfigModuleOptions<Joi.ValidationOptions> {
  public readonly isGlobal = true;

  public readonly load = [
    ServerConfigFactory,
    RedisConfigFactory,
    HmacConfigFactory,
    MongoDBConfigFactory,
  ];

  public readonly validationSchema = [
    ServerValidationSchema,
    RedisValidationSchema,
    HmacValidationSchema,
    MongoDBValidationSchema,
  ].reduce(
    (
      mergedSchema: Joi.AnySchema,
      currentSchema: Joi.AnySchema,
    ): Joi.AnySchema => {
      return mergedSchema.concat(currentSchema);
    },
    Joi.object(),
  );

  public readonly validationOptions = {
    cache: true,
    convert: true,
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true,
  };

  public readonly envFilePath = ['.env'];
}
