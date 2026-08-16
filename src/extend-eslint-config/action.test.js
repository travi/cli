import {getPrompt, logger} from '@form8ion/cli-core';
import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {promptConstants as jsPromptConstants} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import * as commonOptions from '../common/project-options.js';
import {javascriptPluginFactory} from '../common/enhanced-plugins.js';
import extendAction from './action.js';

vi.mock('@form8ion/cli-core');
vi.mock('@form8ion/eslint-config-extender');
vi.mock('../common/project-options.js');

const {
  [jsPromptConstants.ids.JAVASCRIPT_BASE_DETAILS]: baseDetailsQuestionNames
} = jsPromptConstants.questionNames;

describe('extend-eslint-config action', () => {
  it('should define the extend-eslint-config command', async () => {
    const decisions = any.simpleObject();
    const scaffoldOptions = any.simpleObject();
    const extendResults = any.simpleObject();
    const prompt = () => undefined;
    when(commonOptions.defineScaffoldProjectOptions).calledWith(decisions).thenReturn(scaffoldOptions);
    when(getPrompt)
      .calledWith({...decisions, [baseDetailsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM})
      .thenReturn(prompt);
    when(extendEslintConfig)
      .calledWith(scaffoldOptions, javascriptPluginFactory, {prompt, logger})
      .thenResolve(extendResults);

    expect(await extendAction(decisions)).toBe(extendResults);
  });
});
