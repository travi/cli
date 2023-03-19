import * as eslintConfigExtender from '@form8ion/eslint-config-extender';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as commonOptions from '../common/project-options';
import {javascriptScaffolderFactory} from '../common/enhanced-scaffolders';
import extendAction from './action';

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
    when(commonOptions.defineScaffoldProjectOptions).calledWith(decisions).mockReturnValue(scaffoldOptions);
    when(eslintConfigExtender.extendEslintConfig)
      .calledWith(scaffoldOptions, javascriptScaffolderFactory)
      .mockResolvedValue(extendResults);

    expect(await extendAction(decisions)).toBe(extendResults);
  });
});
