import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldTravis} from '@travi/travis-scaffolder-javascript';
import {scaffold as scaffoldNetlify} from '@travi/netlify-scaffolder';
import {scaffold as scaffoldAppEngine} from '@travi/node-app-engine-standard-scaffolder';
import {prompt} from '@travi/gitlab-scaffolder';

export function javascript(options) {
  return scaffoldJavaScript({
    ...options,
    configs: {
      eslint: {prefix: '@travi/travi', packageName: '@travi/eslint-config-travi'},
      commitlint: {name: 'travi', packageName: 'commitlint-config-travi'},
      babelPreset: {name: '@travi', packageName: '@travi/babel-preset'},
      remark: 'remark-preset-lint-travi'
    },
    ciServices: {Travis: {scaffolder: scaffoldTravis, public: true}},
    hosts: {
      Netlify: {projectTypes: ['static'], scaffolder: scaffoldNetlify},
      'App Engine Standard': {projectTypes: ['node'], scaffolder: scaffoldAppEngine}
    }
  });
}

export function gitlabPrompt() {
  return prompt({account: 'travi'});
}
