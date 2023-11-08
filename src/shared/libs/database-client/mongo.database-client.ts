import { inject, injectable } from 'inversify';
import Mongoose from 'mongoose';
import { setTimeout } from 'node:timers/promises';

import { Service } from '../../types/index.js';
import { Logger } from '../logger/index.js';
import { RetryConnection } from './const.js';
import { DatabaseClient } from './database-client.interface.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isconnected = false;

  constructor(@inject(Service.Logger) private readonly logger: Logger) {}

  public get isConnectedToDatabase() {
    return this.isconnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase) {
      throw new Error('MongoDB client is already connected');
    }

    this.logger.info('Trying to connect to MongoDB...');
    let attempt = 0;
    while (attempt < RetryConnection.COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isconnected = true;
        this.logger.info('MongoDB connection is established');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RetryConnection.TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${RetryConnection.COUNT} attempts`);


  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase) {
      throw new Error('MongoDB isn\t connected');
    }

    await this.mongoose.disconnect?.();
    this.isconnected = false;
    this.logger.info('MongoDB connection is closed');
  }
}
