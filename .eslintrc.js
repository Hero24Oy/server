const DB_REGEXP = '*.DB';
const EXCLUDE_NAMES_NAMING_CONVENTION = [
  'photoURL',
  'companyVAT',
  'serviceProviderVAT',
  'customerVAT',
  'heroBIOText',
  'pauseDurationMS',
  'generalPauseDurationMS',
  'downloadURL',
  'databaseURL',
];

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2023,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-import',
    'simple-import-sort',
    'typescript-sort-keys',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // General
    'no-void': ['error', { allowAsStatement: true }], // we allow to use "void" to mark promises we don't wait for
    'no-unused-expressions': ['error'], // we prefer to use callFunction?.() instead of callFunction && callFunction()
    'no-empty-function': [
      'error',
      {
        allow: ['constructors'],
      },
    ],
    'no-param-reassign': 'off', // we need allow parameter reassign
    'no-dupe-keys': 'error',
    'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
    'no-underscore-dangle': ['off'], // we regulate an use of an underscore by other rules
    'no-plusplus': 'off', // It's okay to use ++ operator
    'quote-props': ['error', 'consistent-as-needed'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'arrow-parens': ['error', 'always'],
    curly: ['error', 'all'],
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        ignoreClassFieldInitialValues: true,
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }],
    'prefer-destructuring': 'error',
    'default-case': 'off',
    'func-names': ['error', 'always', { generators: 'never' }],
    'typescript-sort-keys/interface': [
      'error',
      'asc',
      { caseSensitive: false, natural: false, requiredFirst: true },
    ],
    // Import
    'no-duplicate-imports': 'error', // imports from the same source must be in one record
    'import/no-cycle': ['error', { maxDepth: '∞' }],
    'import/prefer-default-export': 'off', // we use only named exports in the project
    '@typescript-eslint/no-shadow': 'error', // Vars with the same name in different scopes are not allowed
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
    ], // Ignore variables with "_" prefix
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off', // a lot of changes if you turn on
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        variables: false, // we should disable this since we use all "styles" vars before their definition
      },
    ],
    '@typescript-eslint/no-inferrable-types': 'off', // we should always set types, even if they are trivial (number, boolean, etc)
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^(@?\\w|\\w)'], // libs
          ['^$\\.*'], // ts-aliases, need update manually
          ['^\\.\\./'], // parent folder imports
          ['^\\./'], // relative folder imports
        ],
      },
    ],
    // Formatting
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: [
          'return',
          'if',
          'export',
          'function',
          'while',
          'try',
          'throw',
          'class',
        ],
      },
      {
        blankLine: 'always',
        prev: ['if', 'function', 'while', 'export', 'throw', 'class'],
        next: '*',
      },
      { blankLine: 'any', prev: 'const', next: ['const', 'let'] },
      { blankLine: 'always', prev: 'const', next: '*' },
      { blankLine: 'any', prev: 'const', next: 'const' },
      {
        blankLine: 'always',
        prev: 'multiline-const',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'multiline-const',
      },
    ],
    // Naming convention
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['strictCamelCase'],
        filter: {
          match: false,
          regex: `(\b${DB_REGEXP}|^(_|${EXCLUDE_NAMES_NAMING_CONVENTION.join(
            '|',
          )}))`,
        },
      },
      {
        selector: 'variable',
        modifiers: ['global'],
        types: ['number', 'string'],
        format: ['UPPER_CASE'],
        filter: {
          match: false,
          regex: `^(_|${EXCLUDE_NAMES_NAMING_CONVENTION.join('|')})`,
        },
      },
      {
        selector: 'variable',
        modifiers: ['destructured'],
        format: ['strictCamelCase', 'StrictPascalCase'],
        filter: {
          match: false,
          regex: `^(_|${EXCLUDE_NAMES_NAMING_CONVENTION.join('|')})`,
        },
      },
      {
        selector: 'variable',
        modifiers: ['exported'],
        format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
        filter: {
          match: false,
          regex: `^(_|${EXCLUDE_NAMES_NAMING_CONVENTION.join('|')})`,
        },
      },
      {
        selector: 'variable',
        types: ['function'],
        format: ['strictCamelCase', 'StrictPascalCase'],
        filter: {
          match: false,
          regex: `^(_|${EXCLUDE_NAMES_NAMING_CONVENTION.join('|')})`,
        },
      },
      {
        selector: 'function',
        format: ['strictCamelCase', 'StrictPascalCase'],
        filter: {
          match: false,
          regex: `^(_|${EXCLUDE_NAMES_NAMING_CONVENTION.join('|')})`,
        },
      },
      {
        selector: 'property',
        format: ['strictCamelCase', 'StrictPascalCase'],
        filter: {
          match: false,
          regex: `^(${EXCLUDE_NAMES_NAMING_CONVENTION.join('|')})`,
        },
      },
      {
        selector: 'enum',
        format: ['StrictPascalCase'],
        filter: {
          match: false,
          regex: `^(_|${EXCLUDE_NAMES_NAMING_CONVENTION.join('|')})`,
        },
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'parameter',
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['StrictPascalCase'],
        prefix: [
          'is',
          'are',
          'has',
          'show',
          'with',
          'use',
          'no',
          'newIs',
          'initialIs',
          'can',
          'should',
        ],
      },
      {
        selector: 'interface',
        format: ['StrictPascalCase'],
        filter: {
          match: false,
          regex: `^(_|${EXCLUDE_NAMES_NAMING_CONVENTION.join('|')})`,
        },
      },
      {
        selector: 'typeLike',
        format: ['StrictPascalCase'],
        filter: {
          match: false,
          regex: `\b${DB_REGEXP}`,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['**/index.ts', '**/*constants.ts'],
      rules: {
        'padding-line-between-statements': [
          'error',
          { blankLine: 'any', prev: 'export', next: 'export' },
        ],
      },
    },
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
