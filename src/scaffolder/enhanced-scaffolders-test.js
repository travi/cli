import * as javascriptScaffolder from '@travi/javascript-scaffolder';
import * as shellScaffolder from '@travi/shell-scaffolder';
import * as gitlabScaffolder from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';
import {scaffold as scaffoldTravisForShell} from '@travi/travis-scaffolder-shell';
import {scaffold as scaffoldCircle} from '@travi/circle-scaffolder-javascript';
import {scaffold as scaffoldNetlify} from '@travi/netlify-scaffolder';
import {scaffold as scaffoldAppEngine} from '@travi/node-app-engine-standard-scaffolder';
import {scaffold as scaffoldSpectacle} from '@travi/spectacle-scaffolder';
import {scaffold as scaffoldMdxDeck} from '@form8ion/mdx-deck';
import {scaffold as scaffoldGithubActionsCI} from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldHapi} from '@form8ion/hapi-scaffolder';
import {scaffold as scaffoldNuxt} from '@form8ion/nuxt';
import {scaffold as scaffoldProbot} from '@form8ion/probot-scaffolder';
import {scaffold as scaffoldReactComponents} from '@form8ion/react-components-scaffolder';
import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import {unitTestFrameworks} from '../common-config';
import {gitlabPrompt, javascriptScaffolderFactory, shell} from './enhanced-scaffolders';

suite('scaffolder factories', () => {
  let sandbox;
  const options = any.simpleObject();
  const output = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(javascriptScaffolder, 'scaffold');
    sandbox.stub(shellScaffolder, 'scaffold');
    sandbox.stub(gitlabScaffolder, 'prompt');
  });

  teardown(() => sandbox.restore());

  test('that the custom properties are passed along with the provided options to the js scaffolder', async () => {
    const decisions = any.simpleObject();
    javascriptScaffolder.scaffold
      .withArgs({
        ...options,
        configs: {
          eslint: {scope: '@travi'},
          commitlint: {name: 'travi', packageName: 'commitlint-config-travi'},
          babelPreset: {name: '@travi', packageName: '@travi/babel-preset'},
          remark: 'remark-preset-lint-travi'
        },
        ciServices: {
          Travis: {scaffolder: scaffoldTravisForJavaScript, public: true, private: false},
          Circle: {scaffolder: scaffoldCircle, public: true, private: true},
          'GitHub Actions': {scaffolder: scaffoldGithubActionsCI, public: true, private: true}
        },
        hosts: {
          Netlify: {projectTypes: ['static'], scaffolder: scaffoldNetlify},
          'App Engine Standard': {projectTypes: ['node'], scaffolder: scaffoldAppEngine}
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
      })
      .resolves(output);

    assert.equal(await javascriptScaffolderFactory(decisions)(options), output);
  });

  test('that the custom properties are passed along with the provided options to the shell scaffolder', async () => {
    shellScaffolder.scaffold
      .withArgs({...options, ciServices: {Travis: {scaffolder: scaffoldTravisForShell, public: true}}})
      .resolves(output);

    assert.equal(await shell(options), output);
  });

  test('that the owner account is passed to the github prompts', async () => {
    gitlabScaffolder.prompt.withArgs({account: 'travi'}).resolves(output);

    assert.equal(await gitlabPrompt(), output);
  });
});
