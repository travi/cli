import {packageManagers} from '@form8ion/javascript-core';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {scaffold as scaffoldCircle} from '@travi/circle-scaffolder-javascript';
import {scaffold as scaffoldGithubActionsCI} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldNetlify} from '@travi/netlify-scaffolder';
import {scaffold as scaffoldAppEngine} from '@travi/node-app-engine-standard-scaffolder';
import * as mdxDeckPlugin from '@form8ion/mdx-deck';
import * as slidevPlugin from '@form8ion/slidev';
import * as spectaclePlugin from '@travi/spectacle-scaffolder';
import * as hapiPlugin from '@form8ion/hapi-scaffolder';
import * as nuxtPlugin from '@form8ion/nuxt';
import * as probotPlugin from '@form8ion/probot-scaffolder';
import * as reactComponentsPlugin from '@form8ion/react-components-scaffolder';
import * as lernaPlugin from '@form8ion/lerna';
import * as rollupPlugin from '@form8ion/rollup';
import * as vitePlugin from '@form8ion/vite';
import * as octoherdScriptPlugin from '@form8ion/octoherd-script';
import * as eslintConfigPlugin from '@form8ion/eslint-config-extender';

import {unitTestFrameworks} from './test-frameworks.js';

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
    plugins: {
      unitTestFrameworks,
      applicationTypes: {
        'MDX Deck': mdxDeckPlugin,
        Slidev: slidevPlugin,
        Spectacle: spectaclePlugin,
        Hapi: hapiPlugin,
        Nuxt: nuxtPlugin,
        Probot: probotPlugin
      },
      packageTypes: {
        'React Component Library': reactComponentsPlugin,
        'Octoherd Script': octoherdScriptPlugin,
        'ESLint Config': eslintConfigPlugin
      },
      monorepoTypes: {Lerna: lernaPlugin},
      packageBundlers: {
        Rollup: rollupPlugin,
        Vite: vitePlugin
      }
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
    decisions: {
      ...decisions,
      [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
    }
  };
}
