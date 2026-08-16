import * as javascriptPlugin from '@form8ion/javascript';
import * as shellPlugin from '@travi/shell-scaffolder';

import {javascriptScaffolderFactory, shell} from './enhanced-scaffolders.js';

export function javascriptPluginFactory(dependencies) {
  return {
    ...javascriptPlugin,
    scaffold: javascriptScaffolderFactory(dependencies)
  };
}

export function shellPluginFactory() {
  return {
    ...shellPlugin,
    scaffold: shell
  };
}
