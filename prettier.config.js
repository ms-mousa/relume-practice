module.exports = {
  trailingComma: "es5",
  semi: false,
  singleQuote: true,
  quoteProps: "consistent",
  bracketSpacing: true,
  arrowParens: "always",
  printWidth: 100,
  tabWidth: 2,
  overrides: [
    {
      files: ".prettierrc",
      options: { parser: "json" }
    },
    {
      files: "*.edge",
      options: { parser: "vue" }
    }
  ],
}