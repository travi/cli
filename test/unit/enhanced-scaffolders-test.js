import * as javascriptScaffolder from '@travi/javascript-scaffolder';
import * as shellScaffolder from '@travi/shell-scaffolder';
import * as gitlabScaffolder from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldTravisForJavaScript} from '@travi/travis-scaffolder-javascript';
import {scaffold as scaffoldTravisForShell} from '@travi/travis-scaffolder-shell';
import {scaffold as scaffoldCircle} from '@travi/circle-scaffolder-javascript';
import {scaffold as scaffoldNetlify} from '@travi/netlify-scaffolder';
import {scaffold as scaffoldAppEngine} from '@travi/node-app-engine-standard-scaffolder';
import {scaffold as scaffoldSpectacle} from '@travi/spectacle-scaffolder';
import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import {gitlabPrompt, javascript, shell} from '../../src/enhanced-scaffolders';

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

  test('that the custom properties are passed along with the provided options to the js scaffolder', () => {
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
          Travis: {scaffolder: scaffoldTravisForJavaScript, public: true},
          Circle: {scaffolder: scaffoldCircle, public: true, private: true}
        },
        hosts: {
          Netlify: {projectTypes: ['static'], scaffolder: scaffoldNetlify},
          'App Engine Standard': {projectTypes: ['node'], scaffolder: scaffoldAppEngine}
        },
        applicationTypes: {Spectacle: {scaffolder: scaffoldSpectacle}}
      })
      .resolves(output);

    return assert.becomes(javascript(options), output);
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
