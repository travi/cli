import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';

export function javascript(options) {
  return scaffoldJavaScript({...options, eslintConfigPrefix: '@travi/travi'});
}
