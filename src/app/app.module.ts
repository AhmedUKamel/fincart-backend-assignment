import { Module } from '@nestjs/common';
import { IngestionModule } from 'src/modules';
import { InfrastructureModule } from 'src/infrastructure';

@Module({
  imports: [InfrastructureModule, IngestionModule],
})
export class AppModule {}
