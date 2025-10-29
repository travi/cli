import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {getPrompt} from '@form8ion/cli-core';

import {defineScaffoldProjectOptions} from '../common/project-options.js';
import {javascriptPluginFactory} from '../common/enhanced-plugins.js';

export default function extendEslintConfigAction(decisions) {
  return extendEslintConfig(
    {...defineScaffoldProjectOptions(decisions), decisions},
    javascriptPluginFactory,
    {prompt: getPrompt(decisions)}
  );
}
