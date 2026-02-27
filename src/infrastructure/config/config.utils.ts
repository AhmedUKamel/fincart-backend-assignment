import * as Joi from 'joi';

export function validateSchema<T>(schema: Joi.AnySchema<T>, data: unknown): T {
  const { value, error } = schema.validate(data, {
    cache: true,
    convert: true,
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true,
  });

  if (error !== undefined) {
    throw new Error(`Environment variables violation: ${error.message}`);
  }

  return value;
}
