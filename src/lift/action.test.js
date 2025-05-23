import {ungroupObject} from '@form8ion/core';
import * as lifter from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import {scaffold as scaffoldOssfScorecard} from '@form8ion/ossf-scorecard';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';
import * as jetbrainsPlugin from '@form8ion/jetbrains';

import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {project} from '../common/plugins.js';
import {javascriptPluginFactory} from '../common/enhanced-plugins.js';
import {unitTesting} from './enhanced-scaffolders.js';
import liftAction from './action.js';

vi.mock('@form8ion/core');
vi.mock('@form8ion/lift');
vi.mock('../common/enhanced-plugins.js');
vi.mock('../common/plugins.js');

describe('lift action', () => {
  it('should define the lift command', async () => {
    const liftingResults = any.simpleObject();
    const enhancedJavascriptPlugin = any.simpleObject();
    const projectPluginGroups = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
    const ungroupedPlugins = any.simpleObject();
    when(ungroupObject).calledWith(projectPluginGroups).thenReturn(ungroupedPlugins);
    when(javascriptPluginFactory).calledWith({}).thenReturn(enhancedJavascriptPlugin);
    when(project).calledWith({}).thenReturn(projectPluginGroups);
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
      enhancers: {...ungroupedPlugins, JetBrains: jetbrainsPlugin}
    }).thenResolve(liftingResults);

    expect(await liftAction()).toEqual(liftingResults);
  });
});
