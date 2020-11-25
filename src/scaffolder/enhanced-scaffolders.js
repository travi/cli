import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldShell} from '@travi/shell-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';
import {scaffold as scaffoldTravisForShell} from '@travi/travis-scaffolder-shell';
import {scaffold as scaffoldCircle} from '@travi/circle-scaffolder-javascript';
import {scaffold as scaffoldNetlify} from '@travi/netlify-scaffolder';
import {scaffold as scaffoldAppEngine} from '@travi/node-app-engine-standard-scaffolder';
import {prompt} from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldSpectacle} from '@travi/spectacle-scaffolder';
import {scaffold as scaffoldMdxDeck} from '@form8ion/mdx-deck';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldNuxt} from '@form8ion/nuxt';
import {scaffold as scaffoldProbot} from '@form8ion/probot-scaffolder';
import {scaffold as scaffoldReactComponents} from '@form8ion/react-components-scaffolder';
import {scaffold as scaffoldGithubActionsCI} from '@form8ion/github-actions-node-ci';
import {unitTestFrameworks} from '../common/test-frameworks';

export function javascriptScaffolderFactory(decisions) {
  return options => scaffoldJavaScript({
    ...options,
    configs: {
      eslint: {scope: '@travi'},
      commitlint: {
        name: 'travi',
        packageName: 'commitlint-config-travi'
      },
      babelPreset: {
        name: '@travi',
        packageName: '@travi/babel-preset'
      },
      remark: 'remark-preset-lint-travi'
    },
    ciServices: {
      Travis: {scaffolder: scaffoldTravisForJavaScript, public: true, private: false},
      Circle: {scaffolder: scaffoldCircle, public: true, private: true},
      'GitHub Actions': {scaffolder: scaffoldGithubActionsCI, public: true, private: true}
    },
    hosts: {
      Netlify: {
        projectTypes: ['static'],
        scaffolder: scaffoldNetlify
      },
      'App Engine Standard': {
        projectTypes: ['node'],
        scaffolder: scaffoldAppEngine
      }
    },
    applicationTypes: {
      'MDX Deck': {scaffolder: scaffoldMdxDeck},
      Spectacle: {scaffolder: scaffoldSpectacle},
      Hapi: {scaffolder: scaffoldHapi},
      Nuxt: {scaffolder: scaffoldNuxt},
      Probot: {scaffolder: scaffoldProbot}
    },
    packageTypes: {
      'React Component Library': {scaffolder: scaffoldReactComponents}
    },
    unitTestFrameworks,
    decisions
  });
}

export function shell(options) {
  return scaffoldShell({...options, ciServices: {Travis: {scaffolder: scaffoldTravisForShell, public: true}}});
}

export function gitlabPrompt() {
  return prompt({account: 'travi'});
}
