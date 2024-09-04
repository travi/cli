import {packageManagers} from '@form8ion/javascript-core';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import * as mdxDeckPlugin from '@form8ion/mdx-deck';
import * as slidevPlugin from '@form8ion/slidev';
import * as spectaclePlugin from '@travi/spectacle-scaffolder';
import * as hapiPlugin from '@form8ion/hapi-scaffolder';
import * as nuxtPlugin from '@form8ion/nuxt';
import * as probotPlugin from '@form8ion/probot-scaffolder';
import * as reactComponentsPlugin from '@form8ion/react-components-scaffolder';
import * as octoherdScriptPlugin from '@form8ion/octoherd-script';
import * as eslintConfigPlugin from '@form8ion/eslint-config-extender';
import * as lernaPlugin from '@form8ion/lerna';
import * as rollupPlugin from '@form8ion/rollup';
import * as vitePlugin from '@form8ion/vite';
import * as netlifyPlugin from '@travi/netlify-scaffolder';
import * as appEngineStandardPlugin from '@travi/node-app-engine-standard-scaffolder';
import * as githubWorkflowsPlugin from '@form8ion/github-actions-node-ci';
import * as circleCiPlugin from '@travi/circle-scaffolder-javascript';
import {unitTestFrameworks} from './test-frameworks.js';

export function plugins() {
  return {
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
    },
    hosts: {
      Netlify: netlifyPlugin,
      'App Engine Standard': appEngineStandardPlugin
    },
    ciServices: {
      'GitHub Actions': githubWorkflowsPlugin,
      Circle: circleCiPlugin
    }
  };
}

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
    plugins: plugins(),
    decisions: {
      ...decisions,
      [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
    }
  };
}
