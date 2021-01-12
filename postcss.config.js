module.exports = {
    minify: true,
    extract: true,
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
      require('cssnano')
    ]
  }
  