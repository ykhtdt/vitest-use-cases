import js from "@eslint/js"
import tseslint from "typescript-eslint"

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["node_modules/**", "dist/**"]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "linebreak-style": [
        "error",
        "unix"
      ],
      "indent": [
        "error",
        2,
        {
          "SwitchCase": 1
        }
      ],
      "no-tabs": [
        "error"
      ],
      "semi": [
        "error",
        "never"
      ],
      "quotes": [
        "error",
        "double"
      ],
      "eol-last": ["error", "always"],
    }
  }
]
