module.exports = {
    minify: true,
    extract: true,
    sourceMap: true,
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
      require('cssnano')
    ]
  }
  