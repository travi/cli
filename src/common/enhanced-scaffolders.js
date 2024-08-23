import {scaffold as scaffoldJavaScript} from '@form8ion/javascript';
import {scaffold as scaffoldShell} from '@travi/shell-scaffolder';
import {scaffold as scaffoldTravisForShell} from '@travi/travis-scaffolder-shell';

import {defineScaffoldJavascriptOptions} from './javascript-options.js';

export function javascriptScaffolderFactory(decisions) {
  return options => scaffoldJavaScript(defineScaffoldJavascriptOptions(decisions, options));
}

export function shell(options) {
  return scaffoldShell({...options, ciServices: {Travis: {scaffolder: scaffoldTravisForShell, public: true}}});
}
