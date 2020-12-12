// eslint-disable-next-line @typescript-eslint/no-var-requires
const autoPreprocess = require('svelte-preprocess')

const config = {
  postcss: true,
  defaults: {
    script: 'typescript',
    style: 'less'
  }
}

module.exports = {
  config,
  preprocess: autoPreprocess(config)
}