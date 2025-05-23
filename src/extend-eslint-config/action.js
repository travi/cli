import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {defineScaffoldProjectOptions} from '../common/project-options.js';
import {javascriptPluginFactory} from '../common/enhanced-plugins.js';

export default function extendEslintConfigAction(decisions) {
  return extendEslintConfig(defineScaffoldProjectOptions(decisions), javascriptPluginFactory);
}
