import * as circleCiPlugin from '@travi/circle-scaffolder-javascript';
import * as githubWorkflowsPlugin from '@form8ion/github-actions-node-ci';
import * as netlifyPlugin from '@travi/netlify-scaffolder';
import * as appEngineStandardPlugin from '@travi/node-app-engine-standard-scaffolder';
import * as mdxDeckPlugin from '@form8ion/mdx-deck';
import * as slidevPlugin from '@form8ion/slidev';
import * as spectaclePlugin from '@travi/spectacle-scaffolder';
import * as hapiPlugin from '@form8ion/hapi-scaffolder';
import * as nuxtPlugin from '@form8ion/nuxt';
import * as probotPlugin from '@form8ion/probot-scaffolder';
import * as reactComponentsPlugin from '@form8ion/react-components-scaffolder';
import * as octoherdScriptPlugin from '@form8ion/octoherd-script';
import * as lernaPlugin from '@form8ion/lerna';
import * as rollupPlugin from '@form8ion/rollup';
import * as vitePlugin from '@form8ion/vite';
import * as eslintConfigPlugin from '@form8ion/eslint-config-extender';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';

import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {unitTestFrameworks} from './test-frameworks.js';
import configs from './javascript-configs.js';
import {defineScaffoldJavascriptOptions, plugins} from './javascript-options.js';

describe('common javascript config', () => {
  it('should define scaffold-js options', () => {
    const options = any.simpleObject();
    const decisions = any.simpleObject();

    expect(defineScaffoldJavascriptOptions(decisions, options)).toEqual({
      ...options,
      configs,
      plugins: plugins(),
      decisions: {
        ...decisions,
        [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM
      }
    });
  });

  it('defines the javascript plugins', () => {
    expect(plugins()).toEqual({
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
    });
  });
});
