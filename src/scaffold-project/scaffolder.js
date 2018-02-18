import {basename} from 'path';
import {prompt} from 'inquirer';
import spdxLicenseList from 'spdx-license-list/simple';
import scaffoldReadme from './readme';
import scaffoldGit from './git';
import scaffoldLicense from './license';
import {
  licenseChoicesShouldBePresented,
  unlicensedConfirmationShouldBePresented,
  vcsHostPromptShouldBePresented
} from './prompt-conditionals';

export const questionNames = {
  PROJECT_NAME: 'projectName',
  VISIBILITY: 'visibility',
  GIT_REPO: 'gitRepo',
  REPO_HOST: 'repoHost',
  UNLICENSED: 'unlicensed',
  LICENSE: 'license'
};

export default async function () {
  const projectRoot = process.cwd();
  const answers = await prompt([
    {name: questionNames.PROJECT_NAME, message: 'What is the name of this project?', default: basename(projectRoot)},
    {
      name: questionNames.VISIBILITY,
      message: 'Should this project be public or private?',
      type: 'list',
      choices: ['Public', 'Private'],
      default: 'Private'
    },
    {
      name: questionNames.UNLICENSED,
      message: 'Since this is a private project, should it be unlicensed?',
      type: 'confirm',
      when: unlicensedConfirmationShouldBePresented,
      default: true
    },
    {
      name: questionNames.LICENSE,
      message: 'How should this this project be licensed?',
      type: 'list',
      when: licenseChoicesShouldBePresented,
      choices: Array.from(spdxLicenseList),
      default: 'MIT'
    },
    {name: questionNames.GIT_REPO, type: 'confirm', default: true, message: 'Should a git repository be initialized?'},
    {
      name: questionNames.REPO_HOST,
      type: 'list',
      when: vcsHostPromptShouldBePresented,
      message: 'Where will the repository be hosted?',
      choices: ['GitHub', 'BitBucket', 'GitLab', 'KeyBase']
    }
  ]);

  return Promise.all([
    scaffoldReadme({projectName: answers[questionNames.PROJECT_NAME], projectRoot}),
    answers[questionNames.GIT_REPO] ? scaffoldGit({projectRoot}) : undefined,
    scaffoldLicense({projectRoot, license: answers[questionNames.LICENSE]})
  ]);
}
