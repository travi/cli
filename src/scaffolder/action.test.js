import {getPrompt} from '@form8ion/cli-core';
import {scaffold as scaffoldProject} from '@form8ion/project';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import * as commonOptions from '../common/project-options.js';
import getAction from './action.js';

describe('scaffolder action', () => {
  const originalConsoleError = console.error;                 // eslint-disable-line no-console

  beforeEach(() => {
    vi.mock('@form8ion/cli-core');
    vi.mock('@form8ion/project');
    vi.mock('../common/project-options');

    console.error = vi.fn();                                  // eslint-disable-line no-console
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.exitCode = 0;
    console.error = originalConsoleError;                     // eslint-disable-line no-console
  });

  it('should provide language and vcs-host scaffolders to the project scaffolder', async () => {
    const decisions = any.simpleObject();
    const scaffoldOptions = any.simpleObject();
    const scaffoldResults = any.simpleObject();
    const prompt = () => undefined;
    when(commonOptions.defineScaffoldProjectOptions).calledWith(decisions).thenReturn(scaffoldOptions);
    when(getPrompt).calledWith(decisions).thenReturn(prompt);
    when(scaffoldProject).calledWith(scaffoldOptions, {prompt}).thenResolve(scaffoldResults);

    expect(await getAction(decisions)()).toEqual(scaffoldResults);
  });
});
