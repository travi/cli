import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';

export function javascript() {
  return options => scaffoldJavaScript({...options, eslintConfigPrefix: '@travi/travi'});
}
