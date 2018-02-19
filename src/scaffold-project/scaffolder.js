import {basename} from 'path';
import {prompt} from 'inquirer';
import spdxLicenseList from 'spdx-license-list/simple';
import scaffoldReadme from './readme';
import scaffoldGit from './git';
import scaffoldLicense from './license';
import {
  copyrightInformationShouldBeRequested,
  licenseChoicesShouldBePresented,
  unlicensedConfirmationShouldBePresented,
  vcsHostPromptShouldBePresented
} from './prompt-conditionals';

export const questionNames = {
  PROJECT_NAME: 'projectName',
  DESCRIPTION: 'description',
  VISIBILITY: 'visibility',
  GIT_REPO: 'gitRepo',
  REPO_HOST: 'repoHost',
  UNLICENSED: 'unlicensed',
  LICENSE: 'license',
  COPYRIGHT_HOLDER: 'copyrightHolder',
  COPYRIGHT_YEAR: 'copyrightYear'
};

const licenseQuestions = [
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
  {
    name: questionNames.COPYRIGHT_HOLDER,
    message: 'Who is the copyright holder of this project?',
    when: copyrightInformationShouldBeRequested,
    default: 'Matt Travi'
  },
  {
    name: questionNames.COPYRIGHT_YEAR,
    message: 'What is the copyright year?',
    when: copyrightInformationShouldBeRequested,
    default: new Date().getFullYear()
  }
];

const vcsQuestions = [
  {name: questionNames.GIT_REPO, type: 'confirm', default: true, message: 'Should a git repository be initialized?'},
  {
    name: questionNames.REPO_HOST,
    type: 'list',
    when: vcsHostPromptShouldBePresented,
    message: 'Where will the repository be hosted?',
    choices: ['GitHub', 'BitBucket', 'GitLab', 'KeyBase']
  }
];

export default async function () {
  const projectRoot = process.cwd();
  const answers = await prompt([
    {name: questionNames.PROJECT_NAME, message: 'What is the name of this project?', default: basename(projectRoot)},
    {name: questionNames.DESCRIPTION, message: 'How should this project be described?'},
    {
      name: questionNames.VISIBILITY,
      message: 'Should this project be public or private?',
      type: 'list',
      choices: ['Public', 'Private'],
      default: 'Private'
    },
    ...licenseQuestions,
    ...vcsQuestions
  ]);

  return Promise.all([
    scaffoldReadme({
      projectName: answers[questionNames.PROJECT_NAME],
      projectRoot,
      description: answers[questionNames.DESCRIPTION]
    }),
    answers[questionNames.GIT_REPO] ? scaffoldGit({projectRoot}) : undefined,
    scaffoldLicense({
      projectRoot,
      license: answers[questionNames.LICENSE],
      copyright: {year: answers[questionNames.COPYRIGHT_YEAR], holder: answers[questionNames.COPYRIGHT_HOLDER]}
    })
  ]);
}
