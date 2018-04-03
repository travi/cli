import fs from 'mz/fs';
import {Repository as gitRepository} from 'nodegit';
import chalk from 'chalk';

export default function ({projectRoot, ignore}) {
  console.log(chalk.blue('Initializing Git Repository'));     // eslint-disable-line no-console
  const {directories, files} = ignore;

  return Promise.all([
    gitRepository.init(projectRoot, 0),
    fs.writeFile(`${projectRoot}/.gitattributes`, '* text=auto'),
    fs.writeFile(`${projectRoot}/.gitignore`, `${directories.join('\n')}\n\n${files.join('\n')}`)
  ]);
}
