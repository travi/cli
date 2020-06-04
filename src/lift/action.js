import {lift} from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {test as jsApplicabilityTest} from '@form8ion/lift-javascript';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {javascript as liftJavascript} from './enhanced-lifters';

export default function () {
  return lift({
    scaffolders: {
      Renovate: scaffoldRenovate,
      'Remove Greenkeeper': removeGreenkeeper,
      Cucumber: scaffoldCucumber,
      'GitHub Actions CI': scaffoldGithubActions
    },
    enhancers: {JavaScript: {test: jsApplicabilityTest, lift: liftJavascript}}
  });
}
