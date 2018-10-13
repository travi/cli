import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldTravis} from '@travi/travis-scaffolder-javascript';
import {prompt} from '@travi/gitlab-scaffolder';

export function javascript(options) {
  return scaffoldJavaScript({
    ...options,
    configs: {
      eslint: {prefix: '@travi/travi', packageName: '@travi/eslint-config-travi'},
      commitlint: {name: 'travi', packageName: 'commitlint-config-travi'},
      babelPreset: {name: 'travi', packageName: 'babel-preset-travi'},
      remark: 'remark-preset-lint-travi'
    },
    ciServices: {Travis: {scaffolder: scaffoldTravis, public: true}}
  });
}

export function gitlabPrompt() {
  return prompt({account: 'travi'});
}
