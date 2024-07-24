import * as lifter from '@form8ion/lift';
import {
  lift as liftRenovate,
  scaffold as scaffoldRenovate,
  test as renovatePredicate
} from '@form8ion/renovate-scaffolder';
import {lift as liftDependabot, test as dependabotPredicate} from '@form8ion/dependabot-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import {scaffold as scaffoldOssfScorecard} from '@form8ion/ossf-scorecard';
import {
  lift as liftGithubActionsCI,
  scaffold as scaffoldGithubActions,
  test as githubActionsCiApplicabilityTest
} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';

import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {unitTesting} from './enhanced-scaffolders.js';
import {javascriptPluginFactory} from '../common/enhanced-plugins.js';
import liftAction from './action.js';

vi.mock('../common/enhanced-plugins.js');
vi.mock('@form8ion/lift');

describe('lift action', () => {
  it('should define the lift command', async () => {
    const liftingResults = any.simpleObject();
    const enhancedJavascriptPlugin = any.simpleObject();
    when(javascriptPluginFactory).calledWith({}).mockReturnValue(enhancedJavascriptPlugin);
    when(lifter.lift).calledWith({
      scaffolders: {
        Renovate: scaffoldRenovate,
        'Remove Greenkeeper': removeGreenkeeper,
        'Unit Testing': unitTesting,
        Cucumber: scaffoldCucumber,
        Cypress: scaffoldCypress,
        'GitHub Actions CI': scaffoldGithubActions,
        'Replace Travis CI with GitHub Actions': replaceTravisCiWithGithubActions,
        'OSSF Scorecard': scaffoldOssfScorecard
      },
      enhancers: {
        JavaScript: enhancedJavascriptPlugin,
        Renovate: {test: renovatePredicate, lift: liftRenovate},
        Dependabot: {test: dependabotPredicate, lift: liftDependabot},
        'GitHub Actions CI': {test: githubActionsCiApplicabilityTest, lift: liftGithubActionsCI}
      }
    }).mockResolvedValue(liftingResults);

    expect(await liftAction()).toEqual(liftingResults);
  });
});
