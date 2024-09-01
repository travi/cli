import * as lifter from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';
import {removeGreenkeeper} from '@form8ion/remove-greenkeeper';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import {scaffold as scaffoldOssfScorecard} from '@form8ion/ossf-scorecard';
import * as githubWorkflowsPlugin from '@form8ion/github-actions-node-ci';
import {scaffold as scaffoldGithubActions} from '@form8ion/github-actions-node-ci';
import {replace as replaceTravisCiWithGithubActions} from '@form8ion/replace-travis-ci-with-github-actions';

import {describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {project} from '../common/plugins.js';
import {unitTesting} from './enhanced-scaffolders.js';
import {javascriptPluginFactory} from '../common/enhanced-plugins.js';
import liftAction from './action.js';

vi.mock('@form8ion/lift');
vi.mock('../common/enhanced-plugins.js');
vi.mock('../common/plugins.js');

describe('lift action', () => {
  it('should define the lift command', async () => {
    const liftingResults = any.simpleObject();
    const enhancedJavascriptPlugin = any.simpleObject();
    const projectPluginGroups = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
    const flattenedPlugins = Object.values(projectPluginGroups)
      .reduce((acc, pluginGroup) => ({...acc, ...pluginGroup}), {});
    when(javascriptPluginFactory).calledWith({}).mockReturnValue(enhancedJavascriptPlugin);
    when(project).calledWith({}).mockReturnValue(projectPluginGroups);
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
        ...flattenedPlugins,
        'GitHub Actions CI': githubWorkflowsPlugin
      }
    }).mockResolvedValue(liftingResults);

    expect(await liftAction()).toEqual(liftingResults);
  });
});
