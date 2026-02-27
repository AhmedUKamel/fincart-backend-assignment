import { EventDto } from 'src/modules/ingestion/domain';
import { Job, Worker } from 'bullmq';
import { EventService } from 'src/modules/workers/domain';
import { ConfigService } from '@nestjs/config';
import { RedisConfig, RedisConfigKey } from 'src/infrastructure';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class EventWorker implements OnModuleInit {
  private readonly logger = new Logger(EventWorker.name);
  private readonly QUEUE_NAME = 'external-events';
  private readonly CONCURRENT_WORKERS_COUNT = 10;
  declare private worker: Worker;

  public constructor(
    private readonly eventService: EventService,
    private readonly configService: ConfigService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const { url } = this.configService.getOrThrow<RedisConfig>(RedisConfigKey);

    this.worker = new Worker(this.QUEUE_NAME, this.processor, {
      connection: { url },
      concurrency: this.CONCURRENT_WORKERS_COUNT,
    });

    this.worker.on('completed', this.onCompleted);
    this.worker.on('failed', this.onFailed);
    this.worker.on('error', this.onError);

    this.logger.log(
      `Worker started with concurrency: ${this.CONCURRENT_WORKERS_COUNT}`,
    );
  }

  private readonly processor = async (job: Job<EventDto>): Promise<void> => {
    this.logger.debug(
      `Handling job '${job.name}' with ID '${job.id ?? 'unknown'} for attempt '${job.attemptsMade + 1}''`,
    );

    await this.eventService.handle(job.data);
  };

  private readonly onCompleted = async (job: Job<EventDto>): Promise<void> => {
    this.logger.debug(
      `Job '${job.name}' with ID '${job.id ?? 'unknown'} completed successfully`,
    );
  };

  private readonly onFailed = async (
    job: Job<EventDto> | undefined,
    error: Error,
  ): Promise<void> => {
    if (job === undefined) {
      return;
    }

    // TODO: Implement moving into dead letter queue

    this.logger.debug(
      `Job '${job.name}' with ID '${job.id ?? 'unknown'} failed in '${job.attemptsMade + 1}': ${error.message}`,
    );
  };

  private readonly onError = async (error: Error): Promise<void> => {
    this.logger.warn(`Worker error: ${error.message}`);
  };
}
