import * as javascriptScaffolder from '@travi/javascript-scaffolder';
import * as gitlabScaffolder from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldtravis} from '@travi/travis-scaffolder-javascript';
import {scaffold as scaffoldCircle} from '@travi/circle-scaffolder-javascript';
import {scaffold as scaffoldNetlify} from '@travi/netlify-scaffolder';
import {scaffold as scaffoldAppEngine} from '@travi/node-app-engine-standard-scaffolder';
import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import {gitlabPrompt, javascript} from '../../src/enhanced-scaffolders';

suite('scaffolder factories', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(javascriptScaffolder, 'scaffold');
    sandbox.stub(gitlabScaffolder, 'prompt');
  });

  teardown(() => sandbox.restore());

  test('that the custom properties are passed along with the provided options', () => {
    const options = any.simpleObject();
    const output = any.simpleObject();

    javascriptScaffolder.scaffold
      .withArgs({
        ...options,
        configs: {
          eslint: {prefix: '@travi/travi', packageName: '@travi/eslint-config-travi'},
          commitlint: {name: 'travi', packageName: 'commitlint-config-travi'},
          babelPreset: {name: '@travi', packageName: '@travi/babel-preset'},
          remark: 'remark-preset-lint-travi'
        },
        ciServices: {
          Travis: {scaffolder: scaffoldtravis, public: true},
          Circle: {scaffolder: scaffoldCircle, public: true, private: true}
        },
        hosts: {
          Netlify: {projectTypes: ['static'], scaffolder: scaffoldNetlify},
          'App Engine Standard': {projectTypes: ['node'], scaffolder: scaffoldAppEngine}
        }
      })
      .resolves(output);

    return assert.becomes(javascript(options), output);
  });

  test('that the owner account is passed to the github prompts', async () => {
    const output = any.simpleObject();
    gitlabScaffolder.prompt.withArgs({account: 'travi'}).resolves(output);

    assert.equal(await gitlabPrompt(), output);
  });
});
