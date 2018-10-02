import fs from 'fs';
import nodeResolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const pkg = require('./package');

function toCamelCase(name) {
  return name.replace(/-(\w)/g, (match, letter) => letter.toUpperCase());
}

const matchSnapshot = process.env.SNAPSHOT === 'match';
const input = './src/index.js';

const globals = Object.keys(pkg.peerDependencies || {}).reduce(
  (acc, key) => Object.assign({}, acc, { [key]: toCamelCase(key) }),
  {},
);

const external = id => !id.startsWith('.') && !id.startsWith('/');

const babelOptions = {
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
};

const commonjsOptions = {
  ignoreGlobal: true,
};

const snapshotOptions = {
  matchSnapshot,
  snapshotPath: './.size-snapshot.json',
};

const createFlowBundlePlugin = {
  transformBundle(code, outputOptions) {
    const file = `${outputOptions.file}.flow`;
    const content = "// @flow\n\nexport * from '../src';";
    fs.writeFileSync(file, content);
  },
};

export default [
  {
    input,
    output: {
      file: `dist/${pkg.name}.js`,
      format: 'umd',
      sourcemap: true,
      exports: 'named',
      name: pkg.name,
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals({ process: false }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot(snapshotOptions),
    ],
  },

  {
    input,
    output: {
      file: `dist/${pkg.name}.min.js`,
      format: 'umd',
      exports: 'named',
      name: pkg.name,
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals({ process: false }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(snapshotOptions),
      uglify(),
    ],
  },

  {
    input,
    output: { file: pkg.main, format: 'cjs', exports: 'named' },
    external,
    plugins: [
      createFlowBundlePlugin,
      babel(babelOptions),
      nodeGlobals({ process: false }),
      sizeSnapshot(snapshotOptions),
    ],
  },

  {
    input,
    output: { file: pkg.module, format: 'esm' },
    external,
    plugins: [
      babel(babelOptions),
      nodeGlobals({ process: false }),
      sizeSnapshot(snapshotOptions),
    ],
  },
];
