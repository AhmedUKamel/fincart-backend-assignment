import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';
import { validateSchema } from './config.utils';

export interface HmacConfig {
  readonly secret: string;
}

interface HmacEnv {
  readonly HMAC_SECRET: string;
}

export const HmacValidationSchema = Joi.object<HmacEnv>({
  HMAC_SECRET: Joi.string().hex().length(64).required(),
});

function createHmacConfig(): HmacConfig {
  const env = validateSchema(HmacValidationSchema, process.env);

  return {
    secret: env.HMAC_SECRET,
  };
}

export const HmacConfigKey = 'hmac';

export const HmacConfigFactory = registerAs(HmacConfigKey, createHmacConfig);
