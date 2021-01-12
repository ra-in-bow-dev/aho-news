const { build } = require("esbuild")
const svelte = require("esbuild-svelte")
const path = require("path")
const { preprocess } = require("./svelte.config")

const dev = !process.env.NODE_ENV === "production"

const options = {
  entryPoints: [path.resolve(__dirname, "src/index.ts")],
  bundle: true,
  minify: !dev,
  treeShaking: !dev,
  outfile: './public/bundle.js',
  plugins: [
    svelte({ preprocessor: preprocess })
  ] //, tsconfig: path.resolve(__dirname, "tsconfig.json")
}

build(options)
  .then(({ warnings }) => {
    if (warnings && warnings.length) {
      warnings.forEach(w => console.warn(w))
      return
    }
    console.log("Bundle created")
    return
  })