import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ConfigModuleOptions } from './config';

@Global()
@Module({
  imports: [ConfigModule.forRoot(new ConfigModuleOptions())],
  providers: [DiscoveryService],
  exports: [DiscoveryService],
})
export class InfrastructureModule {}
