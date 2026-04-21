import eslint from "@eslint/js";
import stylisticPlugin from "@stylistic/eslint-plugin";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import importXPlugin, { createNodeResolver } from "eslint-plugin-import-x";
import nodePlugin from "eslint-plugin-n";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

// -----------------------------------------------------------------------------
// Naming Convention
// -----------------------------------------------------------------------------

const namingConventionBase = [
  {
    format: ["camelCase"],
    selector: "classicAccessor",
  },
  {
    format: ["camelCase"],
    selector: "autoAccessor",
  },

  {
    format: ["PascalCase"],
    selector: "class",
  },
  {
    format: ["camelCase"],
    selector: "classMethod",
  },
  {
    format: ["camelCase"],
    selector: "classProperty",
  },

  {
    format: ["PascalCase"],
    selector: "enum",
  },
  {
    format: ["UPPER_CASE"],
    selector: "enumMember",
  },

  {
    filter: {
      match: false,
      regex: "^(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH|CONNECT|TRACE)$",
    },
    format: ["camelCase", "PascalCase"],
    selector: "function",
  },
  {
    format: null,
    selector: "import",
  },

  {
    format: ["PascalCase"],
    selector: "interface",
  },

  {
    format: ["camelCase", "PascalCase", "snake_case"],
    selector: "objectLiteralMethod",
  },
  {
    format: ["camelCase", "PascalCase", "snake_case"],
    selector: "objectLiteralProperty",
  },
  {
    format: null,
    modifiers: ["requiresQuotes"],
    selector: "objectLiteralProperty",
  },

  {
    format: ["camelCase", "PascalCase", "snake_case"],
    leadingUnderscore: "allow",
    selector: "parameter",
  },
  {
    format: ["camelCase"],
    selector: "parameterProperty",
  },

  {
    format: ["PascalCase"],
    selector: "typeAlias",
  },
  {
    format: ["camelCase"],
    selector: "typeMethod",
  },
  {
    format: ["PascalCase"],
    prefix: ["T"],
    selector: "typeParameter",
  },
  {
    format: ["camelCase", "PascalCase", "snake_case"],
    selector: "typeProperty",
  },

  {
    filter: {
      match: false,
      regex: "^(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH|CONNECT|TRACE)$",
    },
    format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
    leadingUnderscore: "allow",
    selector: "variable",
  },
];

// -----------------------------------------------------------------------------
// Rule Overrides
// -----------------------------------------------------------------------------

/** @type {Record<string, Partial<import("eslint").Linter.RulesRecord>>} */
const rules = {
  eslint: {
    "array-callback-return": "error",
    "arrow-body-style": ["error", "always"],
    "block-scoped-var": "error",
    "consistent-return": "error",
    curly: ["error", "all"],
    "default-case": "error",
    "default-case-last": "error",
    "default-param-last": ["error"],
    eqeqeq: ["error", "smart"],
    "logical-assignment-operators": "error",
    "no-duplicate-imports": "off",
    "no-else-return": "error",
    "no-inner-declarations": "error",
    "no-invalid-this": "error",
    "no-lonely-if": "error",
    "no-multi-assign": "error",
    "no-param-reassign": "error",
    "no-return-assign": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "error",
    "no-template-curly-in-string": "error",
    "no-unneeded-ternary": "error",
    "no-unreachable-loop": "error",
    "no-use-before-define": "error",
    "no-useless-call": "error",
    "no-useless-computed-key": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "object-shorthand": "error",
    "operator-assignment": "error",
    "prefer-exponentiation-operator": "error",
    "prefer-numeric-literals": "error",
    "prefer-object-has-own": "error",
    "prefer-object-spread": "error",
    "prefer-regex-literals": "error",
    "prefer-template": "error",
    radix: "error",
    yoda: "error",
  },
  "import-x": {
    "import-x/newline-after-import": ["error", { count: 1 }],
    "import-x/no-duplicates": ["error", { "prefer-inline": false }],
  },
  n: {
    "n/no-unpublished-import": ["error", { allowModules: ["type-fest", "vitest"] }],
    "n/no-unsupported-features/node-builtins": "warn",
    "n/prefer-global/buffer": "error",
    "n/prefer-global/console": "error",
    "n/prefer-global/crypto": "error",
    "n/prefer-global/process": "error",
    "n/prefer-global/text-decoder": "error",
    "n/prefer-global/text-encoder": "error",
    "n/prefer-global/timers": "error",
    "n/prefer-global/url": "error",
    "n/prefer-global/url-search-params": "error",
    "n/prefer-node-protocol": "error",
  },
  perfectionist: {
    "perfectionist/sort-classes": "off",
    "perfectionist/sort-imports": [
      "error",
      {
        customGroups: [
          {
            elementNamePattern: "^server-only$",
            groupName: "server-only",
            selector: "side-effect",
          },
          {
            elementNamePattern: "^@shadow/shared/styles$",
            groupName: "global-style-0-shadow",
            newlinesInside: 0,
            selector: "style",
          },
          {
            elementNamePattern: String.raw`^@mantine/core/styles\.css$`,
            groupName: "global-style-1-mantine-core",
            newlinesInside: 0,
            selector: "style",
          },
          {
            elementNamePattern: String.raw`^@mantine/.+/styles\.css$`,
            groupName: "global-style-2-mantine",
            newlinesInside: 0,
            selector: "style",
          },
          // Local styles patterns
          {
            elementNamePattern: String.raw`^\./.+\.(css|scss)$`,
            groupName: "style",
            selector: "style",
          },
          {
            elementNamePattern: String.raw`^\.\./.+\.(css|scss)$`,
            groupName: "style",
            selector: "style",
          },
          {
            elementNamePattern: String.raw`^.+\.(css|scss)$`,
            groupName: "style",
            selector: "style",
          },
        ],
        groups: [
          "server-only",
          "side-effect",
          "global-style-0-shadow",
          "global-style-1-mantine-core",
          "global-style-2-mantine",
          [
            "type-import",
            "type-internal",
            "type-parent",
            "type-sibling",
            "type-index",
          ],
          "value-builtin",
          "value-external",
          "value-internal",
          ["value-parent", "value-sibling", "value-index"],
          "style",
          "unknown",
        ],
        ignoreCase: true,
        internalPattern: ["^@/.+", "^~/.+"],
        newlinesBetween: 1,
        order: "asc",
        tsconfig: { rootDir: "." },
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-modules": "off",
    "perfectionist/sort-union-types": [
      "error",
      {
        groups: [
          "named",
          "keyword",
          "operator",
          "literal",
          "function",
          "import",
          "conditional",
          "object",
          "tuple",
          "intersection",
          "union",
          "unknown",
          "nullish",
        ],
        ignoreCase: true,
        order: "asc",
        type: "alphabetical",
      },
    ],
  },
  stylistic: {
    "@stylistic/brace-style": ["error", "1tbs"],
    "@stylistic/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        multilineDetection: "brackets",
        singleline: {
          delimiter: "semi",
          requireLast: true,
        },
      },
    ],
    "@stylistic/operator-linebreak": "off",
    "@stylistic/quote-props": ["error", "as-needed"],
    "@stylistic/quotes": ["error", "double"],
    "@stylistic/semi": ["error", "always"],
  },
  "typescript-eslint": {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        disallowTypeAnnotations: true,
        fixStyle: "separate-type-imports",
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/naming-convention": ["error", ...namingConventionBase],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allow: [{ from: "lib", name: ["Error", "URL", "URLSearchParams"] }],
        allowAny: true,
        allowBoolean: true,
        allowNullish: true,
        allowNumber: true,
        allowRegExp: true,
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------

/** @type {Array<Partial<import("eslint").Linter.Config>>} */
const tseslintConfig = [
  ...tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked.at(-1) ?? {},
];

export default defineConfig(
  // Global ignores (replacement for .eslintignore)
  globalIgnores([
    ".git",
    ".next",
    ".turbo",
    ".vs",
    ".vscode",
    "bin",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "obj",
    "out",
    "public",
    "**/supabase.ts",
  ]),

  // JavaScript Options
  {
    // Configs
    extends: [
      eslint.configs.recommended,
      tseslintConfig,
      importXPlugin.flatConfigs.recommended,
      importXPlugin.flatConfigs.typescript,
      nodePlugin.configs["flat/recommended"],
      perfectionistPlugin.configs["recommended-alphabetical"],
      stylisticPlugin.configs.recommended,
    ],
    // include patterns
    files: ["**/*.{js,ts,mjs,mts,cjs,cts,jsx,tsx}"],
    // options
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.serviceworker,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      sourceType: "module",
    },
    // rules
    rules: {
      ...rules.eslint,
      ...rules["typescript-eslint"],
      ...rules["import-x"],
      ...rules.n,
      ...rules.perfectionist,
      ...rules.stylistic,
    },
    // settings
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver(),
        createNodeResolver(),
      ],
    },
  },
);
