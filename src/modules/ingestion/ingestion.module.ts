import { Module } from '@nestjs/common';
import { EventController } from './presentation';
import { IngestionService } from './application';
import { IngestionProviders } from './ingestion.providers';

@Module({
  controllers: [EventController],
  providers: [IngestionProviders.QUEUE_SERVICE, IngestionService],
})
export class IngestionModule {}
