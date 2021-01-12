module.exports = {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  proseWrap: "always",
  endOfLine: "lf",
  trailingComma: "es5",
  svelteSortOrder: "scripts-markup-styles",
  svelteStrictMode: false,
  svelteBracketNewLine: true,
  svelteAllowShorthand: true,
  plugins: ["prettier-plugin-svelte"],
  overrides: [
      {
          files: "*.ts",
          options: {
              parser: "typescript"
          }
      }
  ]
}