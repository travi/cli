import * as addPackage from '@form8ion/add-package-to-monorepo';
import {logger} from '@form8ion/cli-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import * as jsOptions from '../common/javascript-options.js';
import addPackageAction from './action.js';

vi.mock('@form8ion/add-package-to-monorepo');
vi.mock('../common/javascript-options.js');

describe('add-package action', () => {
  it('should add a package to the monorepo', async () => {
    const decisions = any.simpleObject();
    const options = any.simpleObject();
    const results = any.simpleObject();
    when(jsOptions.defineScaffoldJavascriptOptions).calledWith(decisions).thenReturn(options);
    when(addPackage.scaffold).calledWith(options, {logger}).thenResolve(results);

    expect(await addPackageAction(decisions)).toEqual(results);
  });
});
