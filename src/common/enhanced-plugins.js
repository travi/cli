import * as javascriptPlugin from '@form8ion/javascript';
import * as shellPlugin from '@travi/shell-scaffolder';

import {javascriptScaffolderFactory, shell} from './enhanced-scaffolders.js';
import {javascriptLifterFactory, javascriptTesterFactory} from './enhanced-lifters.js';

export function javascriptPluginFactory(decisions, dependencies) {
  return {
    ...javascriptPlugin,
    test: javascriptTesterFactory(dependencies),
    scaffold: javascriptScaffolderFactory(decisions, dependencies),
    lift: javascriptLifterFactory(dependencies)
  };
}

export function shellPluginFactory() {
  return {
    ...shellPlugin,
    scaffold: shell
  };
}
