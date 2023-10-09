import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { createOffer } from '../../shared/helpers/offer.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './command.interface.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/models/user/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/models/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import { Offer } from '../../shared/types/index.js';
import { DEFAULT_DB_PORT } from './command.const.js';
import { getMongoURI } from '../../shared/helpers/database.js';

export class ImportCommand implements Command {
  private readonly name = '--import';
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return this.name;
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported`);
  }

  private async saveOffer(offer: Offer,) {
    const user = await this.userService.findOrCreate({ ...offer.author }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      date: offer.date,
      city: offer.city,
      preview: offer.preview,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      rooms: offer.rooms,
      guests: offer.guests,
      price: offer.price,
      goods: offer.goods,
      authorId: user.id,
      latitude: offer.latitude,
      longitude: offer.longitude,
    });
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    try {
      if (!filename || filename.trim().length === 0) {
        throw new Error('No <path> argument');
      }

      const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
      this.salt = salt;

      await this.databaseClient.connect(uri);

      const fileReader = new TSVFileReader(filename.trim());

      fileReader.on('line', this.onImportedLine);
      fileReader.on('end', this.onCompleteImport);

      await fileReader.read();
    } catch (error) {
      console.error(chalk.red(`Can't import data from file ${filename}`));
      console.error(chalk.red(`Details: ${getErrorMessage(error)}`));
    }
  }
}
