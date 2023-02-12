module.exports = {
    env: {
      browser: true,
      node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
      "plugin:prettier/recommended",
    ],
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-var-requires": "off",
      "react/prop-types": ["warn", { skipUndeclared: true }],
    },
  };