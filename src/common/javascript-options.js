import {packageManagers} from '@form8ion/javascript-core';
import {questionNames as jsQuestionNames} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';
import {scaffold as scaffoldCircle} from '@travi/circle-scaffolder-javascript';
import {scaffold as scaffoldGithubActionsCI} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldNetlify} from '@travi/netlify-scaffolder';
import {scaffold as scaffoldAppEngine} from '@travi/node-app-engine-standard-scaffolder';
import {scaffold as scaffoldMdxDeck} from '@form8ion/mdx-deck';
import {scaffold as scaffoldSpectacle} from '@travi/spectacle-scaffolder';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldNuxt} from '@form8ion/nuxt';
import {scaffold as scaffoldProbot} from '@form8ion/probot-scaffolder';
import {scaffold as scaffoldReactComponents} from '@form8ion/react-components-scaffolder';
import {unitTestFrameworks} from './test-frameworks';

export function defineScaffoldJavascriptOptions(decisions, options) {
  return {
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
    decisions: {
      ...decisions,
      [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
    }
  };
}
