import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBConfig, MongoDBConfigKey } from '../config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory as IMongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseOptionsFactory implements IMongooseOptionsFactory {
  public constructor(private readonly configService: ConfigService) {}

  public createMongooseOptions(): MongooseModuleOptions {
    const { uri } =
      this.configService.getOrThrow<MongoDBConfig>(MongoDBConfigKey);

    return { uri };
  }
}
