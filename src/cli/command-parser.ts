type ParsedCommand = Record<string, string[]>;

export class CommandParser {
  static parse(cliArguments: string[]): ParsedCommand {
    let currentCommand = '';

    return cliArguments.slice(2).reduce(
      (parsedCommand: ParsedCommand, argument) => {
        {
          currentCommand = argument.startsWith('--') ? argument : currentCommand;

          return {
            ...parsedCommand,
            [currentCommand]: parsedCommand[currentCommand] ? [...parsedCommand[currentCommand], argument] : [],
          };
        }
      },
      {}
    );
  }
}
