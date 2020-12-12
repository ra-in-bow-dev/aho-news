/* eslint-disable @typescript-eslint/no-var-requires */
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescriptPlugin from '@rollup/plugin-typescript'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

const dev = process.env.ROLLUP_WATCH
const preprocessConfig = require('./svelte.config.js').config
const preprocess = sveltePreprocess(preprocessConfig)
export default {
	input: 'src/main.ts',
	output: {
		sourcemap: dev,
		format: 'iife',
		name: 'bundle',
		file: 'static/bundle.js'
	},
	plugins: [
		svelte({ preprocess }),
		resolve({ browser: true, dedupe: ['svelte'] }),
		commonjs({ transformMixedEsModules: true, }),
		typescriptPlugin(),
		postcss(),
		dev && serve(),
		dev && livereload('static'),
		!dev && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
