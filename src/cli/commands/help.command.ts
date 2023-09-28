import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  private readonly name = '--help';

  public getName(): string {
    return this.name;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(
      chalk.blue(`
      Программа для подготовки данных для REST API сервера
      Пример:
          ${chalk.green('cli.js --<command> [--arguments]')}
      Команды:
          ${chalk.green('--version')}:                    # выводит номер версии
          ${chalk.green('--help')}:                       # печатает этот текст
          ${chalk.green('--import <path>')}:              # импортирует данные из TSV
          ${chalk.green('--generate <n> <path> <url>')}:  # генерирует произвольное количество тестовых данных
    `)
    );
  }
}
