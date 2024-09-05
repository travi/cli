import {ungroupObject} from '@form8ion/core';
import {lift} from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import {scaffold as scaffoldOssfScorecard} from '@form8ion/ossf-scorecard';
import * as jetbrainsPlugin from '@form8ion/jetbrains';

import {project as projectPlugins} from '../common/plugins.js';
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
      ...ungroupObject(projectPlugins({})),
      JetBrains: jetbrainsPlugin
    }
  });
}
