import chalk from 'chalk';
import { getErrorMessage } from '../../shared/helpers/common.js';
import { createOffer } from '../../shared/helpers/offer.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private readonly name = '--import';

  public getName(): string {
    return this.name;
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    try {
      if (!filename || filename.trim().length === 0) {
        throw new Error('No <path> argument');
      }

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
