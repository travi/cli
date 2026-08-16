import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {getPrompt, logger} from '@form8ion/cli-core';
import {promptConstants as jsPromptConstants} from '@form8ion/javascript';
import {packageManagers} from '@form8ion/javascript-core';

import {defineScaffoldProjectOptions} from '../common/project-options.js';
import {javascriptPluginFactory} from '../common/enhanced-plugins.js';

const {
  [jsPromptConstants.ids.JAVASCRIPT_BASE_DETAILS]: baseDetailsQuestionNames
} = jsPromptConstants.questionNames;

export default function extendEslintConfigAction(decisions) {
  return extendEslintConfig(
    defineScaffoldProjectOptions(decisions),
    javascriptPluginFactory,
    {
      prompt: getPrompt({...decisions, [baseDetailsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM}),
      logger
    }
  );
}
