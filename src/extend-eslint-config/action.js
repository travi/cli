import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {javascriptScaffolderFactory} from '../common/enhanced-scaffolders';
import {defineScaffoldProjectOptions} from '../common/options';

export default function (decisions) {
  return extendEslintConfig(defineScaffoldProjectOptions(decisions), javascriptScaffolderFactory);
}
