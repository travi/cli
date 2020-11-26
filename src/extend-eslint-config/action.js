import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {javascriptScaffolderFactory} from '../common/enhanced-scaffolders';
import {defineScaffoldProjectOptions} from '../common/project-options';

export default function (decisions) {
  return extendEslintConfig(defineScaffoldProjectOptions(decisions), javascriptScaffolderFactory);
}
