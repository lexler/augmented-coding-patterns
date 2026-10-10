import projectConfig from "../eslint.config.mjs";

const habitHooksSmellRules = {
  "max-lines-per-function": [
    "error",
    { max: 12, skipBlankLines: false, skipComments: false, IIFEs: true },
  ],
  "max-params": ["error", 3],
  complexity: ["error", 10],
  "max-depth": ["error", { max: 4 }],
  "max-lines": ["error", { max: 200, skipBlankLines: false, skipComments: false }],
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
  eqeqeq: ["error", "always"],
  "no-var": "error",
  "prefer-const": "error",
  "no-duplicate-imports": "error",
  "no-warning-comments": [
    "warn",
    { terms: ["todo", "fixme", "xxx", "hack"], location: "anywhere" },
  ],
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-non-null-assertion": "warn",
  "@typescript-eslint/no-inferrable-types": "error",
};

const habitHooksConfig = [
  ...projectConfig,
  { files: ["**/*.ts", "**/*.tsx"], rules: habitHooksSmellRules },
];

export default habitHooksConfig;
