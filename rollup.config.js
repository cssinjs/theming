const pkg = require('./package.json');
import rollupBabel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

const minify = process.env.MINIFY;
const format = process.env.FORMAT;
const esm = format === 'es';
const umd = format === 'umd';
const cjs = format === 'cjs';

let targets;

if (esm) {
  targets = [{dest: `dist/theming.es.js`, format: 'es'}];
} else if (umd) {
  if (minify) {
    targets = [{dest: `dist/theming.umd.min.js`, format: 'umd'}];
  } else {
    targets = [{dest: `dist/theming.umd.js`, format: 'umd'}];
  }
} else if (cjs) {
  targets = [{dest: `dist/theming.cjs.js`, format: 'cjs'}];
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`);
} else {
  throw new Error('no format specified. --environment FORMAT:xxx');
}

const esmEntry = 'src/index.js';
const umdEntry = 'src/umd-entry.js';
const exports = esm ? 'named' : 'default';

const external = [ 'react', 'prop-types' ];
if (!umd) external.push(...Object.keys(pkg.dependencies));

export default {
  entry: esm ? esmEntry : umdEntry,
  targets,
  exports,
  moduleName: 'theming',
  format,
  external,
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
  plugins: [
    nodeResolve({ jsnext: true, module: true, main: true }),
    commonjs({ include: 'node_modules/**' }),
    rollupBabel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['env', {modules: false}], 'stage-0', 'react'],
      plugins: ['external-helpers'],
    }),
    minify ? uglify() : null,
  ].filter(Boolean),
};
