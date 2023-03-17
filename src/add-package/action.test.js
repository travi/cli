import * as addPackage from '@form8ion/add-package-to-monorepo';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as jsOptions from '../common/javascript-options';
import addPackageAction from './action';

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
    when(jsOptions.defineScaffoldJavascriptOptions).calledWith(decisions).mockReturnValue(options);
    when(addPackage.scaffold).calledWith(options).mockResolvedValue(results);

    expect(await addPackageAction(decisions)).toEqual(results);
  });
});
