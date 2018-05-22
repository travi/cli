import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';

export function javascript(options) {
  return scaffoldJavaScript({
    ...options,
    configs: {
      eslint: {prefix: '@travi/travi', packageName: '@travi/eslint-config-travi'},
      commitlint: {name: 'travi', packageName: 'commitlint-config-travi'},
      babelPreset: {name: 'travi', packageName: 'babel-preset-travi'}
    }
  });
}
