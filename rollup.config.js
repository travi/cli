/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import executable from 'rollup-plugin-executable';

export default {
  input: 'src/index.js',
  external: [
    'path',
    'commander',
    'inquirer',
    'inquander',
    'chalk',
    'update-notifier',
    'mz/fs',
    'nodegit',
    'spdx-license-list/simple',
    'spdx-license-list/full',
    'mustache',
    'shelljs'
  ],
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true
    }),
    json(),
    babel({
      babelrc: false,
      exclude: ['./node_modules/**'],
      presets: [['env', {targets: {node: 'current'}, modules: false}]]
    }),
    executable()
  ],
  output: [{file: 'bin/travi.js', format: 'cjs', sourcemap: true, banner: '#!/usr/bin/env node'}]
};
