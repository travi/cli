import {scaffold as scaffoldJavaScript} from '@travi/javascript-scaffolder';
import {scaffold as scaffoldTravis} from '@travi/travis-scaffolder-javascript';

export function javascript(options) {
  return scaffoldJavaScript({
    ...options,
    configs: {
      eslint: {prefix: '@travi/travi', packageName: '@travi/eslint-config-travi'},
      commitlint: {name: 'travi', packageName: 'commitlint-config-travi'},
      babelPreset: {name: 'travi', packageName: 'babel-preset-travi'}
    },
    ciServices: {Travis: {scaffolder: scaffoldTravis, public: true}}
  });
}
