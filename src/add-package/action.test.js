import * as addPackage from '@form8ion/add-package-to-monorepo';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import * as jsOptions from '../common/javascript-options.js';
import addPackageAction from './action.js';

describe('add-package action', () => {
  beforeEach(() => {
    vi.mock('@form8ion/add-package-to-monorepo');
    vi.mock('../common/javascript-options');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add a package to the monorepo', async () => {
    const decisions = any.simpleObject();
    const options = any.simpleObject();
    const results = any.simpleObject();
    when(jsOptions.defineScaffoldJavascriptOptions).calledWith(decisions).thenReturn(options);
    when(addPackage.scaffold).calledWith(options).thenResolve(results);

    expect(await addPackageAction(decisions)).toEqual(results);
  });
});
