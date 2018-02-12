import {prompt} from 'inquirer';
import chalk from 'chalk';

export const questionNames = {
  PROJECT_NAME: 'projectName',
  GIT_REPO: 'gitRepo',
  REPO_HOST: 'repoHost'
};

export default async function () {

  const answers = await prompt([
    {name: questionNames.PROJECT_NAME, message: 'What is the name of this project?'},
    {name: questionNames.GIT_REPO, type: 'confirm', default: true, message: 'Should a git repository be initialized?'},
    {
      name: questionNames.REPO_HOST,
      type: 'list',
      message: 'Where will the repository be hosted?',
      choices: ['GitHub', 'BitBucket', 'GitLab', 'KeyBase']
    }
  ]);

  console.log(chalk.blue('Generating README'));
  console.log(chalk.green(answers))

}
