import {lift} from '@form8ion/lift';
import * as renovatePlugin from '@form8ion/renovate-scaffolder';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import * as dependabotPlugin from '@form8ion/dependabot-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import {
  lift as liftGithubActionsCI,
  scaffold as scaffoldGithubActions,
  test as githubActionsCiApplicabilityTest
} from '@form8ion/github-actions-node-ci';
import * as githubPlugin from '@form8ion/github';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import {scaffold as scaffoldOssfScorecard} from '@form8ion/ossf-scorecard';

import {javascriptPluginFactory} from '../common/enhanced-plugins.js';
import {unitTesting} from './enhanced-scaffolders.js';

export default function () {
  return lift({
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
      JavaScript: javascriptPluginFactory({}),
      Renovate: renovatePlugin,
      Dependabot: dependabotPlugin,
      GitHub: githubPlugin,
      'GitHub Actions CI': {test: githubActionsCiApplicabilityTest, lift: liftGithubActionsCI}
    }
  });
}
