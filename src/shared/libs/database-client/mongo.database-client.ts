import { inject, injectable } from 'inversify';
import { DatabaseClient } from './database-client.interface.js';
import * as Mongoose from 'mongoose';
import { Service } from '../../types/index.js';
import { Logger } from '../logger/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isconnected: boolean;

  constructor(@inject(Service.Logger) private readonly logger: Logger) {
    this.isconnected = false;
  }

  public isConnectedToDatabase() {
    return this.isconnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB client is already connected');
    }

    this.logger.info('Trying to connect to MongoDB');
    this.mongoose = await Mongoose.connect(uri);
    this.isconnected = true;
    this.logger.info('MongoDB connection is established');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error('MongoDB isn\t connected');
    }

    await this.mongoose.disconnect?.();
    this.isconnected = false;
    this.logger.info('MongoDB connection is closed');
  }
}
