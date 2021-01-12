module.exports = {
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./src/**/*.svelte",
      "./src/**/*.html",
    ]
  },
  darkMode: 'class', // or 'media'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
