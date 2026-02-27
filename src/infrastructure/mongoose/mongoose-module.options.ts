import { MongooseModuleAsyncOptions as IMongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { MongooseOptionsFactory } from './mongoose-options.factory';

export class MongooseModuleAsyncOptions implements IMongooseModuleAsyncOptions {
  public readonly useClass = MongooseOptionsFactory;
}
