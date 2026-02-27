import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { HmacConfig, HmacConfigKey } from 'src/infrastructure';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class HmacSignatureGuard implements CanActivate {
  private readonly ALGORITHM = 'sha256';
  private readonly SIGNATURE_HEADER_KEY = 'x-signature';

  public constructor(private readonly configService: ConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    const httpHost = context.switchToHttp();
    const request = httpHost.getRequest<FastifyRequest>();

    const receivedSignature = this.getRequestSignature(request);
    const rawBody = this.getRequestRawBody(request);

    const expectedSignature = this.buildRequestSignature(rawBody);

    this.validateAndMatchSignatures(receivedSignature, expectedSignature);

    return true;
  }

  private getRequestSignature(reqest: FastifyRequest): string {
    const signature = reqest.headers[this.SIGNATURE_HEADER_KEY];

    if (signature === undefined) {
      throw new UnauthorizedException('Missing signature header');
    }

    return Array.isArray(signature) ? signature[0] : signature;
  }

  private buildRequestSignature(rawBody: Buffer): string {
    const { secret } = this.configService.getOrThrow<HmacConfig>(HmacConfigKey);

    return createHmac(this.ALGORITHM, secret).update(rawBody).digest('hex');
  }

  private validateAndMatchSignatures(
    receivedSignature: string,
    expectedSignature: string,
  ): void {
    const receivedSignatureBuffer = Buffer.from(receivedSignature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    const isValidSignature =
      receivedSignatureBuffer.length === expectedSignatureBuffer.length &&
      timingSafeEqual(receivedSignatureBuffer, expectedSignatureBuffer);

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid HMAC signature');
    }
  }

  private getRequestRawBody(reqest: FastifyRequest): Buffer {
    if ('rawBody' in reqest && Buffer.isBuffer(reqest.rawBody)) {
      return reqest.rawBody;
    }

    throw new BadRequestException('Failed to parse request body');
  }
}
