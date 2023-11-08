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
          ${chalk.green('--version')}:                    # выводит номер версии приложения из package.json
          ${chalk.green('--help')}:                       # печатает текст помощи по командам
          ${chalk.green('--import <path>')}:              # импортирует данные из файла TSV по пути <path>
          ${chalk.green('--generate <n> <path> <url>')}:  # генерирует количество <n> тестовых данных в файл <path> по начальным API данным с адреса <url>
    `)
    );
  }
}
