import * as javascriptPlugin from '@form8ion/javascript';
import * as shellScaffolder from '@travi/shell-scaffolder';
import * as gitlabScaffolder from '@travi/gitlab-scaffolder';
import {scaffold as scaffoldTravisForShell} from '@travi/travis-scaffolder-shell';
import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import * as commonJavascriptOptions from './javascript-options';
import {gitlabPrompt, javascriptScaffolderFactory, shell} from './enhanced-scaffolders';

suite('scaffolder factories', () => {
  let sandbox;
  const options = any.simpleObject();
  const output = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(javascriptPlugin, 'scaffold');
    sandbox.stub(shellScaffolder, 'scaffold');
    sandbox.stub(gitlabScaffolder, 'prompt');
    sandbox.stub(commonJavascriptOptions, 'defineScaffoldJavascriptOptions');
  });

  teardown(() => sandbox.restore());

  test('that the custom properties are passed along with the provided options to the js scaffolder', async () => {
    const decisions = any.simpleObject();
    const scaffoldJavascriptOptions = any.simpleObject();
    commonJavascriptOptions.defineScaffoldJavascriptOptions
      .withArgs(decisions, options)
      .returns(scaffoldJavascriptOptions);
    javascriptPlugin.scaffold.withArgs(scaffoldJavascriptOptions).resolves(output);

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
