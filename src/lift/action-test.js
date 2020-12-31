import * as lifter from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import {test as jsApplicabilityTest} from '@form8ion/lift-javascript';
import {
  scaffold as scaffoldGithubActions,
  lift as liftGithubActionsCI,
  test as githubActionsCiApplicabilityTest
} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {unitTesting} from './enhanced-scaffolders';
import {javascript as liftJavascript} from './enhanced-lifters';
import liftAction from './action';

suite('lift action', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(lifter, 'lift');
  });

  teardown(() => sandbox.restore());

  test('that the lift command is defined', async () => {
    const liftingResults = any.simpleObject();
    lifter.lift
      .withArgs({
        scaffolders: {
          Renovate: scaffoldRenovate,
          'Remove Greenkeeper': removeGreenkeeper,
          'Unit Testing': unitTesting,
          Cucumber: scaffoldCucumber,
          Cypress: scaffoldCypress,
          'GitHub Actions CI': scaffoldGithubActions,
          'Replace Travis CI with GitHub Actions': replaceTravisCiWithGithubActions
        },
        enhancers: {
          JavaScript: {test: jsApplicabilityTest, lift: liftJavascript},
          'GitHub Actions CI': {test: githubActionsCiApplicabilityTest, lift: liftGithubActionsCI}
        }
      })
      .resolves(liftingResults);

    assert.equal(await liftAction(), liftingResults);
  });
});
