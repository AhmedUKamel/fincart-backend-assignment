import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class AppValidationPipe extends ValidationPipe {
  public constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        let message: string | undefined;
        const error = errors.at(0);

        if (error) {
          const constraints = error.constraints ?? {};
          message = Object.values(constraints).at(0);
        }

        return new BadRequestException(message);
      },
    });
  }
}
