#!/usr/bin/env node
import 'reflect-metadata';
import { CLIApplication, HelpCommand, ImportCommand, VersionCommand, GenerateCommand } from './cli/index.js';

const bootstrap = () => {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);
  cliApplication.processCommand(process.argv);
};

bootstrap();
