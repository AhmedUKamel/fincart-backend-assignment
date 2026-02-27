import * as Joi from 'joi';
import { ServerConfigFactory, ServerValidationSchema } from './server';
import { ConfigModuleOptions as IConfigModuleOptions } from '@nestjs/config';

export class ConfigModuleOptions implements IConfigModuleOptions<Joi.ValidationOptions> {
  public readonly load = [ServerConfigFactory];

  public readonly validationSchema = [ServerValidationSchema].reduce(
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
