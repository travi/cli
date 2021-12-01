/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import executable from 'rollup-plugin-executable';
import autoExternal from 'rollup-plugin-auto-external';

export default {
  input: 'src/index.js',
  plugins: [
    autoExternal(),
    nodeResolve({mainFields: ['module']}),
    json(),
    babel({
      babelrc: false,
      exclude: ['./node_modules/**'],
      presets: [['@travi', {targets: {node: '8'}, modules: false}]]
    }),
    executable()
  ],
  output: [{file: 'bin/travi.js', format: 'cjs', sourcemap: true, banner: '#!/usr/bin/env node'}]
};
