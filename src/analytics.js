#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const util = require('util');
const tmp = require('tmp-promise');
const isWindows = require('is-windows');
const escape = require('js-string-escape');
const rollup = require('rollup');
const alias = require('@rollup/plugin-alias');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const readdir = require('./readdir');
const pkg = require('../package.json');

const { log } = console;
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const FILE_ANALYTICS = /\.spec\.js$/;

program.option('-g, --global <name>', 'Name for the exported library.');
program.version(pkg.version);
program.parse(process.argv);

log('[analytics] starting...');

const cwd = process.cwd();

async function start() {
  const files = await readdir(cwd);

  const requireCode = files
    .filter((file) => (file.match(FILE_ANALYTICS)))
    .map((file) => {
      const resolved = path.resolve(cwd, file);
      const dir = isWindows()
        ? escape(escape(resolved))
        : resolved;
      return `require('${dir}')`;
    })
    .join(',');

  const data = await readFile(path.resolve(__dirname, 'ServiceAnalytics.js'), {
    encoding: 'utf8',
  });

  const tmpFile = await tmp.file({
    postfix: '.js',
  });

  await writeFile(tmpFile.path, data.replace('/* imports */', requireCode));

  const name = program.global || 'ServiceAnalyticsOutput';

  async function runRollup(env) {
    const isProduction = (env === 'prd');

    const filename = (
      isProduction
        ? `${name}.min.js`
        : `${name}.js`
    );

    const plugins = [
      commonjs(),
      alias({
        entries: [
          {
            find: 'src',
            replacement: __dirname,
          },
        ],
      }),
      babel({ babelHelpers: 'bundled' }),
    ];

    if (isProduction) {
      plugins.push(terser());
    }

    const bundle = await rollup.rollup({
      input: tmpFile.path,
      plugins,
    });

    await bundle.write({
      format: 'umd',
      name,
      file: path.resolve(cwd, filename),
    });
  }

  await runRollup('dev');
  await runRollup('prd');

  log('[analytics] done.');

  await tmpFile.cleanup();
}

start();
