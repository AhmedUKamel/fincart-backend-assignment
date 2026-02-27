import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscoveryService } from '@nestjs/core';
import { ConfigModuleOptions } from './config';
import { MongooseModuleAsyncOptions } from './mongoose';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(new ConfigModuleOptions()),
    MongooseModule.forRootAsync(new MongooseModuleAsyncOptions()),
  ],
  providers: [DiscoveryService],
  exports: [DiscoveryService],
})
export class InfrastructureModule {}
