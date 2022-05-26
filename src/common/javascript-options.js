import {packageManagers} from '@form8ion/javascript-core';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {scaffold as scaffoldCircle} from '@travi/circle-scaffolder-javascript';
import {scaffold as scaffoldGithubActionsCI} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldNetlify} from '@travi/netlify-scaffolder';
import {scaffold as scaffoldAppEngine} from '@travi/node-app-engine-standard-scaffolder';
import {scaffold as scaffoldMdxDeck} from '@form8ion/mdx-deck';
import {scaffold as scaffoldSlidev} from '@form8ion/slidev';
import {scaffold as scaffoldSpectacle} from '@travi/spectacle-scaffolder';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldNuxt} from '@form8ion/nuxt';
import {scaffold as scaffoldProbot} from '@form8ion/probot-scaffolder';
import {scaffold as scaffoldReactComponents} from '@form8ion/react-components-scaffolder';
import {scaffold as scaffoldLerna} from '@form8ion/lerna';
import {scaffold as scaffoldRollup} from '@form8ion/rollup';
import {scaffold as scaffoldVite} from '@form8ion/vite';

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
      Slidev: {scaffolder: scaffoldSlidev},
      Spectacle: {scaffolder: scaffoldSpectacle},
      Hapi: {scaffolder: scaffoldHapi},
      Nuxt: {scaffolder: scaffoldNuxt},
      Probot: {scaffolder: scaffoldProbot}
    },
    packageTypes: {
      'React Component Library': {scaffolder: scaffoldReactComponents}
    },
    monorepoTypes: {Lerna: {scaffolder: scaffoldLerna}},
    unitTestFrameworks,
    packageBundlers: {
      Rollup: {scaffolder: scaffoldRollup},
      Vite: {scaffolder: scaffoldVite}
    },
    decisions: {
      ...decisions,
      [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
    }
  };
}
