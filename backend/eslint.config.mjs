import globals from "globals";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import sonarjs from "eslint-plugin-sonarjs";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
      "sonarjs": sonarjs,
    },
    rules: {
      "no-else-return": "error",
      "sonarjs/cognitive-complexity": ["error", 10],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "no-implicit-coercion": "error",
      "max-lines-per-function": ["error", { max: 50 }],
      "sonarjs/no-duplicate-string": "error",
    },
  },
];