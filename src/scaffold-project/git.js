import fs from 'mz/fs';
import chalk from 'chalk';

export default function({projectRoot}) {
  console.log(chalk.blue('Initializing Git Repository'));

  return fs.writeFile(`${projectRoot}/.gitattributes`, '* text=auto');
}
