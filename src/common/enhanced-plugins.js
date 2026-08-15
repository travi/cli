import * as javascriptPlugin from '@form8ion/javascript';
import * as shellPlugin from '@travi/shell-scaffolder';

import {javascriptScaffolderFactory, shell} from './enhanced-scaffolders.js';
import {getJavascriptPrompt} from './prompts.js';

export function javascriptPluginFactory(decisions, dependencies) {
  return {
    ...javascriptPlugin,
    scaffold: javascriptScaffolderFactory({...dependencies, prompt: getJavascriptPrompt(decisions)})
  };
}

export function shellPluginFactory() {
  return {
    ...shellPlugin,
    scaffold: shell
  };
}
