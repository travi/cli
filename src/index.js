import program from 'commander';
import inquander from 'inquander';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';

program
  .version(pkg.version);

program
  .command('scaffold')
  .description('scaffold a new project')
  .action(() => console.log(chalk.blue('Hello world!')));

inquander.parse(program, process.argv);

updateNotifier({pkg}).notify();
