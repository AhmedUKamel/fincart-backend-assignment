import { ApiResponse } from 'src/modules/common';
import { EventRequest } from '../dto/requests/event.request';
import { IngestionService } from '../../application';
import {
  Body,
  Post,
  Logger,
  HttpCode,
  Controller,
  HttpStatus,
} from '@nestjs/common';

@Controller({ path: 'events', version: '1' })
export class EventController {
  private readonly logger = new Logger(EventController.name);

  public constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  public async ingestEvent(@Body() event: EventRequest): Promise<ApiResponse> {
    const startsAt = Date.now();

    await this.ingestionService.ingestEvent(event);

    const duration = Date.now() - startsAt;

    this.logger.debug(`Event with ID '${event.id}' accepted in ${duration}ms`);
    return ApiResponse.success('Event accepted successfully');
  }
}
