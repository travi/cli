import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {javascriptScaffolderFactory} from '../common/enhanced-scaffolders';
import {defineScaffoldOptions} from '../common/options';

export default function (decisions) {
  return extendEslintConfig(defineScaffoldOptions(decisions), javascriptScaffolderFactory);
}
