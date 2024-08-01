import * as javascriptPlugin from '@form8ion/javascript';
import * as shellPlugin from '@travi/shell-scaffolder';

import {javascriptScaffolderFactory, shell} from './enhanced-scaffolders.js';
import {javascript as enhancedLiftJavascript} from './enhanced-lifters.js';

export function javascriptPluginFactory(decisions) {
  return {
    ...javascriptPlugin,
    scaffold: javascriptScaffolderFactory(decisions),
    lift: enhancedLiftJavascript
  };
}

export function shellPluginFactory() {
  return {
    ...shellPlugin,
    scaffold: shell
  };
}
