import {scaffold as scaffoldJavaScript} from '@form8ion/javascript';
import {scaffold as scaffoldShell} from '@travi/shell-scaffolder';
import {scaffold as scaffoldTravisForShell} from '@travi/travis-scaffolder-shell';
import {prompt} from '@travi/gitlab-scaffolder';
import {defineScaffoldJavascriptOptions} from './javascript-options';

export function javascriptScaffolderFactory(decisions) {
  return options => scaffoldJavaScript(defineScaffoldJavascriptOptions(decisions, options));
}

export function shell(options) {
  return scaffoldShell({...options, ciServices: {Travis: {scaffolder: scaffoldTravisForShell, public: true}}});
}

export function gitlabPrompt() {
  return prompt({account: 'travi'});
}
