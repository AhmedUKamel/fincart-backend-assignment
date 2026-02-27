import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ConfigModuleOptions } from './config';

@Global()
@Module({
  imports: [ConfigModule.forRoot(new ConfigModuleOptions())],
})
export class InfrastructureModule {}
