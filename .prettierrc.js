module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'avoid',
  overrides: [
    {
      files: '*.swcrc',
      options: {
        parser: 'json',
      },
    },
  ],
};
