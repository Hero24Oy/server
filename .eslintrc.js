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
  'refFromURL',
];
const excludeNamesNamingConventionRegex =
  EXCLUDE_NAMES_NAMING_CONVENTION.join('|');
const underscoreAndExcludeNamingConventionRegex = `^(_|${excludeNamesNamingConventionRegex})`;

const initialRules = {
  'eslint-comments/require-description': [
    'warn',
    { ignore: ['eslint-enable'] },
  ], // we don't need to comment why we used "eslint-enable"
  'eslint-comments/disable-enable-pair': 'off',
  'prefer-arrow-callback': 'error',
  'arrow-parens': ['error', 'always'],
  'quote-props': ['error', 'consistent-as-needed'],
  quotes: ['error', 'single', { avoidEscape: true }],
  curly: ['error', 'all'],
  'no-plusplus': 'off', // It's okay to use ++ operator
  'no-void': ['error', { allowAsStatement: true }], // we allow to use "void" to mark promises we don't wait for
  'no-unused-expressions': ['error'], // we prefer to use callFunction?.() instead of callFunction && callFunction()
  'no-empty-function': [
    'error',
    {
      allow: ['constructors'],
    },
  ],
  'no-param-reassign': 'error',
  'no-dupe-keys': 'error',
  'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
  'no-underscore-dangle': ['off'], // we regulate an use of an underscore by other rules
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
};

const tsRules = {
  '@typescript-eslint/no-shadow': 'error', // Vars with the same name in different scopes are not allowed
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
  ], // Ignore variables with "_" prefix
  '@typescript-eslint/no-unused-expressions': ['error'],
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/no-use-before-define': [
    'error',
    {
      variables: false,
    },
  ],
  '@typescript-eslint/no-inferrable-types': 'off', // we should always set types, even if they are trivial (number, boolean, etc)
  'class-methods-use-this': 'off',
  'consistent-return': 'off',
  // TODO: switch on error this rules after quitting firebase
  '@typescript-eslint/no-unsafe-assignment': 'warn',
  '@typescript-eslint/no-unsafe-member-access': 'warn',
  '@typescript-eslint/no-unsafe-return': 'warn',
};

const spellCheckerRule = {
  '@cspell/spellchecker': [
    'error',
    {
      checkComments: true,
    },
  ],
};

const importSortOrderRule = {
  'simple-import-sort/imports': [
    'error',
    {
      groups: [
        ['^(@?\\w|\\w)'], // libs
        ['^\\.\\./'], // parent folder imports
        ['^\\./'], // relative folder imports
        ['^$\\.*'], // ts-aliases
      ],
    },
  ],
};

const importRules = {
  'import/extensions': 'off', // if error then throws error on $module/???/module
  'no-duplicate-imports': 'error', // imports from the same source must be in one record
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['lodash', '!lodash/'], // disallow imports from 'lodash' directly
          message: "Please use 'lodash/*' instead.",
        },
      ],
    },
  ],
  'import/no-cycle': ['error', { maxDepth: '∞' }],
  'import/prefer-default-export': 'off', // we use only named exports in the project
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: ['scripts/*.ts'],
    },
  ],
  ...importSortOrderRule,
};

const paddingsRule = {
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
};

const namingConventionRule = {
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'default',
      format: ['strictCamelCase'],
      filter: {
        match: false,
        regex: `(\b${DB_REGEXP}|^(_|${excludeNamesNamingConventionRegex}))`,
      },
    },
    {
      selector: 'variable',
      modifiers: ['global'],
      types: ['number', 'string'],
      format: ['UPPER_CASE'],
      filter: {
        match: false,
        regex: underscoreAndExcludeNamingConventionRegex,
      },
    },
    {
      selector: 'variable',
      modifiers: ['destructured'],
      format: ['strictCamelCase', 'StrictPascalCase'],
      filter: {
        match: false,
        regex: underscoreAndExcludeNamingConventionRegex,
      },
    },
    {
      selector: 'variable',
      modifiers: ['exported'],
      format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
      filter: {
        match: false,
        regex: underscoreAndExcludeNamingConventionRegex,
      },
    },
    {
      selector: 'variable',
      types: ['function'],
      format: ['strictCamelCase', 'StrictPascalCase'],
      filter: {
        match: false,
        regex: underscoreAndExcludeNamingConventionRegex,
      },
    },
    {
      selector: 'function',
      format: ['strictCamelCase', 'StrictPascalCase'],
      filter: {
        match: false,
        regex: underscoreAndExcludeNamingConventionRegex,
      },
    },
    {
      selector: 'property',
      format: ['strictCamelCase', 'StrictPascalCase'],
      filter: {
        match: false,
        regex: underscoreAndExcludeNamingConventionRegex,
      },
    },
    {
      selector: 'enum',
      format: ['StrictPascalCase'],
      filter: {
        match: false,
        regex: underscoreAndExcludeNamingConventionRegex,
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
        regex: underscoreAndExcludeNamingConventionRegex,
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
};

const override = {
  tsFilesOnlyWithExports: {
    files: ['**/index.ts', '**/*constants.ts'],
    rules: {
      'padding-line-between-statements': [
        'error',
        { blankLine: 'any', prev: 'export', next: 'export' },
      ],
    },
  },
  js: {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  modules: {
    files: ['**/*.module.ts'],
    rules: {
      'import/no-cycle': 'off',
    },
  },
  dto: {
    files: ['**/*.dto.ts', '**/*.enum.ts'],
    rules: {
      '@typescript-eslint/no-redeclare': 'off',
    },
  },
  namingConventionExceptions: {
    files: [
      'src/modules/hub-spot/hub-spot-contact/hub-spot-contact.constants.ts',
      'src/config/*.ts',
      'src/app.module.ts',
      '**/*.dto.ts',
      '**/*.enum.ts',
    ],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
  },
  enableAsyncMethodsWithoutAwait: {
    files: [
      '**/*.context.ts',
      '**/*.subscription.ts',
      '**/*.module.ts',
      '**/*.service.ts',
      '**/*.resolver.ts',
      '**/*.interceptor.ts',
    ],
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },
  env: {
    files: ['env.d.ts'],
    rules: {
      'typescript-sort-keys/interface': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  },
  disableReturnType: {
    files: [
      'src/common/decorators/**/*.ts', // we don't need set return type for decorators
      'src/config/*.ts', // we don't need duplicate type
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  importExtensions: {
    files: ['src/*.ts', "src/**/*.ts"],
    rules: {
      "import/extensions": "off",
    },
  }
};

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
    'plugin:eslint-comments/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@cspell/recommended',
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
    ...initialRules,
    ...tsRules,
    ...spellCheckerRule,
    ...importRules,
    ...paddingsRule,
    ...namingConventionRule,
  },
  overrides: [
    override.tsFilesOnlyWithExports,
    override.js,
    override.dto,
    override.modules,
    override.namingConventionExceptions,
    override.enableAsyncMethodsWithoutAwait,
    override.env,
    override.disableReturnType,
    override.importExtensions,
  ],
};
