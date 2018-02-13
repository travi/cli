import {basename} from 'path';
import {prompt} from 'inquirer';
import scaffoldReadme from './readme';
import scaffoldGit from './git';

export const questionNames = {
  PROJECT_NAME: 'projectName',
  GIT_REPO: 'gitRepo',
  REPO_HOST: 'repoHost'
};

export default async function () {
  const projectRoot = process.cwd();
  const answers = await prompt([
    {name: questionNames.PROJECT_NAME, message: 'What is the name of this project?', default: basename(projectRoot)},
    {name: questionNames.GIT_REPO, type: 'confirm', default: true, message: 'Should a git repository be initialized?'},
    {
      name: questionNames.REPO_HOST,
      type: 'list',
      message: 'Where will the repository be hosted?',
      choices: ['GitHub', 'BitBucket', 'GitLab', 'KeyBase']
    }
  ]);

  return Promise.all([
    scaffoldReadme({projectName: answers[questionNames.PROJECT_NAME], projectRoot}),
    answers[questionNames.GIT_REPO] ? scaffoldGit({projectRoot}) : undefined
  ]);
}
