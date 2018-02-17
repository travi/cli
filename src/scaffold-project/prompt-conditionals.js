import {questionNames} from './scaffolder';

export function vcsHostPromptShouldBePresented(answers) {
  return answers[questionNames.GIT_REPO];
}
