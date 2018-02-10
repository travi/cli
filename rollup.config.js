/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.js',
  external: [
    'commander',
    'inquander',
    'chalk',
    'update-notifier'
  ],
  plugins: [
    json(),
    babel({
      babelrc: false,
      exclude: ['./node_modules/**'],
      presets: [['env', {targets: {node: 'current'}, modules: false}]]
    })
  ],
  output: [{file: 'bin/travi.js', format: 'cjs', sourcemap: true, banner: '#!/usr/bin/env node'}]
};
