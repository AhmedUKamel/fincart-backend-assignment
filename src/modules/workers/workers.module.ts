import { Module } from '@nestjs/common';
import { EventWorker } from './infrastructure';
import { EventService } from './domain';

@Module({
  providers: [EventService, EventWorker],
})
export class WorkerModule {}
