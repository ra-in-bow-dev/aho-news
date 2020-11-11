module.exports = {
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    trailingComma: "es5",
    svelteSortOrder: "styles-markup-scripts",
    svelteStrictMode: true,
    svelteBracketNewLine: true,
    svelteAllowShorthand: false,
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
    