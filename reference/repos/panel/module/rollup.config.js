
const pkg = require('./package.json');

const typescript = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-json');
const sass = require('rollup-plugin-sass');

module.exports = {
  input: 'src/index.tsx',
  output: {
    file: pkg.main,
    format: 'es',
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    sass()
  ],
};
