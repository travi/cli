import {lift} from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import {test as jsApplicabilityTest} from '@form8ion/lift-javascript';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import {javascript as liftJavascript} from './enhanced-lifters';
import {unitTesting} from './enhanced-scaffolders';

export default function () {
  return lift({
    scaffolders: {
      Renovate: scaffoldRenovate,
      'Remove Greenkeeper': removeGreenkeeper,
      'Unit Testing': unitTesting,
      Cucumber: scaffoldCucumber,
      Cypress: scaffoldCypress,
      'GitHub Actions CI': scaffoldGithubActions,
      'Replace Travis CI with GitHub Actions': replaceTravisCiWithGithubActions
    },
    enhancers: {JavaScript: {test: jsApplicabilityTest, lift: liftJavascript}}
  });
}
