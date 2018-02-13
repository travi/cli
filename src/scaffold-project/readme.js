import fs from 'mz/fs';
import chalk from 'chalk';

export default function({projectName, projectRoot}) {
  console.log(chalk.blue('Generating README'));

  return fs.writeFile(`${projectRoot}/README.md`, `# ${projectName}\n`);
}
