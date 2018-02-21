import {questionNames} from './scaffolder';

export function scopePromptShouldBePresented(answers) {
  return 'Package' === answers[questionNames.PACKAGE_TYPE];
}
