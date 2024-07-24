import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {javascriptScaffolderFactory} from '../common/enhanced-scaffolders.js';
import {defineScaffoldProjectOptions} from '../common/project-options.js';

export default function (decisions) {
  return extendEslintConfig(defineScaffoldProjectOptions(decisions), javascriptScaffolderFactory);
}
