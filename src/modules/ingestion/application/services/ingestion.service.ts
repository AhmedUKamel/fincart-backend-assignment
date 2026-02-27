import { Inject, Injectable } from '@nestjs/common';
import { EventDto, IQueueService } from '../../domain';
import { IngestionTokens } from '../../ingestion.tokens';

@Injectable()
export class IngestionService {
  public constructor(
    @Inject(IngestionTokens.QUEUE_SERVICE)
    private readonly queueService: IQueueService,
  ) {}

  public async ingestEvent(event: EventDto): Promise<void> {
    await this.queueService.enqueue(event);
  }
}
