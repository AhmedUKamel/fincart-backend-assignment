import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { EventDto, IQueueService } from 'src/modules/ingestion/domain';
import { RedisConfig, RedisConfigKey } from 'src/infrastructure';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class QueueService implements IQueueService, OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private readonly QUEUE_NAME = 'external-events';
  declare private queue: Queue;

  public constructor(private readonly configService: ConfigService) {}

  public async onModuleInit(): Promise<void> {
    try {
      const { url } =
        this.configService.getOrThrow<RedisConfig>(RedisConfigKey);

      this.queue = new Queue(this.QUEUE_NAME, {
        connection: { url },

        defaultJobOptions: {
          attempts: 4,
          backoff: {
            type: 'exponential',
            delay: 1_000,
          },
          removeOnFail: false,
        },
      });

      const version = await this.queue.getVersion();

      this.logger.log(
        `Initialized '${this.QUEUE_NAME}' queue with version '${version}' on redis`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Failed to initialize '${this.QUEUE_NAME}' queue on redis: ${message}`,
      );

      throw error;
    }
  }

  public async enqueue(event: EventDto): Promise<void> {
    const jobId = this.createJobId(event);

    await this.queue.add('process-event', event, { jobId });

    this.logger.debug(`Event with job ID '${jobId}' enqueued`);
  }

  private createJobId(event: EventDto): string {
    const { id, type } = event;

    return `${type}_${id}`;
  }
}
