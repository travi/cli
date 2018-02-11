import program from 'commander';
import chalk from 'chalk';

export default function ({version}) {
  program.version(version);

  program
    .command('scaffold')
    .description('scaffold a new project')
    .action(() => console.log(chalk.blue('Hello world!')));

  return program;
}
