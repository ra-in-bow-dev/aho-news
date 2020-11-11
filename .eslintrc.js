module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    env: {
      es6: true,
      browser: true,
      node: true,
    },
    plugins: ["@typescript-eslint", "svelte3"],
    extends: ["plugin:@typescript-eslint/recommended" , "prettier", "prettier/@typescript-eslint"],
    overrides: [
      {
        files: ["*.svelte"],
        processor: "svelte3/svelte3",
      }
    ],
  };
  