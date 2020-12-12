module.exports = {
    plugins: {
      "postcss-nested": {},
      "postcss-normalize": {},
      "postcss-custom-media": {
        preserve: false,
        importFrom: "src/styles/breakpoints.ts",
      },
      autoprefixer: {},
      cssnano: {
        preset: "default",
      },
    },
  };
  