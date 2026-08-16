import * as addPackage from '@form8ion/add-package-to-monorepo';
import {getPrompt, logger} from '@form8ion/cli-core';
import {reportResults} from '@form8ion/results-reporter';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import * as jsOptions from '../common/javascript-options.js';
import addPackageAction from './action.js';

vi.mock('@form8ion/add-package-to-monorepo');
vi.mock('@form8ion/cli-core');
vi.mock('@form8ion/results-reporter');
vi.mock('../common/javascript-options.js');

describe('add-package action', () => {
  it('should add a package to the monorepo', async () => {
    const decisions = any.simpleObject();
    const options = any.simpleObject();
    const prompt = () => undefined;
    const results = any.simpleObject();
    when(jsOptions.defineScaffoldJavascriptOptions).calledWith().thenReturn(options);
    when(getPrompt).calledWith(decisions).thenReturn(prompt);
    when(addPackage.scaffold).calledWith(options, {logger, prompt}).thenResolve(results);

    expect(await addPackageAction(decisions)).toEqual(results);

    expect(reportResults).toHaveBeenCalledWith(results);
  });
});
