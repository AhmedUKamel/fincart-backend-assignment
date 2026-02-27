import { ApiResponse } from '../dto/api.response';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  Logger,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';

export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  public catch(exception: unknown, host: ArgumentsHost): void {
    const httpHost = host.switchToHttp();
    const request = httpHost.getRequest<FastifyRequest>();
    const response = httpHost.getResponse<FastifyReply>();

    const httpException =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException();

    const exceptionResponse = httpException.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : httpException.message;
    const statusCode = httpException.getStatus();

    const apiResponse = new ApiResponse(false, message);

    response.code(statusCode).send(apiResponse);

    this.logger.error(
      `Request '${request.id}' ${JSON.stringify({ path: request.url, ip: request.ip })} failed: ${message}`,
    );
  }
}
