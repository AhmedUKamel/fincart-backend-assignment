import { QueueService } from './infrastructure';
import { IngestionTokens } from './ingestion.tokens';

export const IngestionProviders = {
  QUEUE_SERVICE: {
    provide: IngestionTokens.QUEUE_SERVICE,
    useClass: QueueService,
  },
};
