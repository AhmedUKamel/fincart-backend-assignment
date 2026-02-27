import { Module } from '@nestjs/common';
import { WorkerModule } from 'src/modules/workers/workers.module';
import { InfrastructureModule } from 'src/infrastructure';
import { IngestionModule, ShipmentModule } from 'src/modules';

@Module({
  imports: [
    InfrastructureModule,
    IngestionModule,
    ShipmentModule,
    WorkerModule,
  ],
})
export class AppModule {}
