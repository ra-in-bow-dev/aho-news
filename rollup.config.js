import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'

const postcssConfig = require('./postcss.config')
const dev = process.env.ROLLUP_WATCH

export default {
	input: 'src/index.ts',
	output: {
		sourcemap: dev,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js'
	},
	plugins: [
		svelte({
			emitCss: false,
			compilerOptions: { css: false }, // o => o.write('public/bundle.css') },
			preprocess: sveltePreprocess(), //{ postcss: { extract: 'public/bundle.css' } })
		}),
		postcss({ ...postcssConfig, extract: 'bundle.css' }),
		resolve({ browser: true, dedupe: ['svelte'] }),
		commonjs(),
		typescript({ sourceMap: !!dev }),
		dev && livereload('public'),
		!dev && terser()
	],
	watch: { clearScreen: false }
}