import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescriptPlugin from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import svelte from 'rollup-plugin-svelte'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'

const dev = !!process.env.ROLLUP_WATCH
const postcssConfig = require('./postcss.config')
const svelteConfig = require('./svelte.config')
const tsConfig = require('./tsconfig.json')

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  },
  plugins: [
    svelte({
      compilerOptions: { dev },
      ...svelteConfig,
      emitCss: true,
    }),
    postcss(postcssConfig),
    json(),
    resolve({ browser: true, dedupe: ['svelte'] }),
    commonjs({ transformMixedEsModules: true }),
    typescriptPlugin({ sourceMap: dev, ...tsConfig.compilerOptions }),
    dev && serve(),
    dev && livereload('public'),
    !dev && terser(),
  ],
}

function serve() {
  let started = false
  console.log('starting server...')
  return {
    writeBundle() {
      if (!started) {
        started = true
        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        })
      }
    },
  }
}
