import fs from 'mz/fs';
import {Repository as gitRepository} from 'nodegit';
import chalk from 'chalk';

export default function({projectRoot}) {
  console.log(chalk.blue('Initializing Git Repository'));

  return Promise.all([
    gitRepository.init(projectRoot, 0),
    fs.writeFile(`${projectRoot}/.gitattributes`, '* text=auto')
  ]);
}
