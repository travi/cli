import * as eslintConfigExtender from '@form8ion/eslint-config-extender';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import * as commonOptions from '../common/project-options.js';
import {javascriptPluginFactory} from '../common/enhanced-plugins.js';
import extendAction from './action.js';

describe('extend-eslint-config action', () => {
  beforeEach(() => {
    vi.mock('@form8ion/eslint-config-extender');
    vi.mock('../common/project-options');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should define the extend-eslint-config command', async () => {
    const decisions = any.simpleObject();
    const scaffoldOptions = any.simpleObject();
    const extendResults = any.simpleObject();
    when(commonOptions.defineScaffoldProjectOptions).calledWith(decisions).thenReturn(scaffoldOptions);
    when(eslintConfigExtender.extendEslintConfig)
      .calledWith(scaffoldOptions, javascriptPluginFactory)
      .thenResolve(extendResults);

    expect(await extendAction(decisions)).toBe(extendResults);
  });
});
