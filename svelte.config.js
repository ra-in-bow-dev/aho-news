const { globalStyle, postcss } = require("svelte-preprocess")
const { typescript } = require('svelte-preprocess-esbuild')
const postcssConfig = require('./postcss.config')
module.exports = { preprocess: [ typescript(), postcss(postcssConfig), globalStyle() ] }
