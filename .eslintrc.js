module.exports = {
  root: true,
  extends: ['react-app', 'prettier'],
  globals: {
    // testcafe globals
    fixture: false,
    test: false,
  },
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['simple-import-sort', 'import', 'jest', 'testing-library', 'prettier', 'sonarjs'],
  // Global rules tha applies to all files
  rules: {
    'prettier/prettier': ['error'],
    'react/jsx-curly-brace-presence': [1, { props: 'never', children: 'never' }],
    'react/jsx-fragments': ['error', 'element'],
    'simple-import-sort/imports': 'error', // turned on for all files
    'simple-import-sort/exports': 'error', // turned on for all files
    // imports should be on top of the file. allows adding imports anywhere and saving should snap it to the top
    'import/first': 'error',
    'import/newline-after-import': 'error', // new line between external & internal imports
    'import/no-duplicates': 'error', // no duplicate imports should be allowed
    'spaced-comment': ['error', 'always', { markers: ['!', '?', '*', '/'] }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Identifier[name="useDebugDependencyWatch"]',
        message: 'useDebugDependencyWatch() should only be used for development',
      },
    ],
    // Restricting invalid imports
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: 'Instead, import from lodash nested path e.g. lodash/uniq',
          },
          {
            name: 'styled-components',
            message: 'Instead, import from styled-components/macro',
          },
        ],
        patterns: [
          // Importing modules from dist folder of individual cmg packages is not allowed
          '@cmg/*/dist/*',
          // Cross package imports are not allowed
          '**/*/api/src/*',
          '**/*/api/dist/*',
          '**/*/auth/src/*',
          '**/*/auth/dist/*',
          '**/*/common/src/*',
          '**/*/common/dist/*',
          '**/*/design-system/src/*',
          '**/*/design-system/dist/*',
          '**/*/design-system-formik/src/*',
          '**/*/design-system-formik/dist/*',
          '**/*/docs-client/src/*',
          '**/*/docs-client/dist/*',
          '**/*/e2e-selectors/src/*',
          '**/*/e2e-selectors/dist/*',
          '**/*/e2e-tests/src/*',
          '**/*/e2e-tests/dist/*',
          '**/*/ecm-client-web/src/*',
          '**/*/ecm-client-web/dist/*',
          '**/*/email-templates/src/*',
          '**/*/email-templates/dist/*',
          '**/*/graphql-api/src/*',
          '**/*/graphql-api/dist/*',
          '**/*/identity-client-web/src/*',
          '**/*/identity-client-web/dist/*',
          '**/*/testing/src/*',
          '**/*/testing/dist/*',
          '**/*/tools/src/*',
          '**/*/tools/dist/*',
          '**/*/xc-client-web/src/*',
          '**/*/xc-client-web/dist/*',
          '**/*/xc-draft-spec-docs/src/*',
          '**/*/xc-draft-spec-docs/dist/*',
          '**/*/apps/**/src/*',
          '**/*/dist/apps/*',
          '**/*/libs/**/src/*',
          '**/*/dist/libs/*',
        ],
      },
    ],
    'no-debugger': 'error',
    'no-nested-ternary': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-var': 'error',
    'no-param-reassign': 'error',
    curly: ['error'],
    // Jest testing rules
    'jest/no-disabled-tests': 'warn',
    'jest/no-alias-methods': 'error',
    'jest/no-focused-tests': 'error', // reminds dev to remove .only from your tests
    'jest/no-identical-title': 'error',
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['expect', 'screen.getBy*', 'screen.findBy*'],
      },
    ],
    'jest/no-commented-out-tests': 'error',
    'jest/no-done-callback': 'error',
    'jest/no-duplicate-hooks': 'error',
    'jest/no-export': 'error',
    'jest/no-jasmine-globals': 'error',
    'jest/no-jest-import': 'error',
    'jest/no-test-return-statement': 'error',
    'jest/prefer-comparison-matcher': 'error',
    'jest/prefer-hooks-on-top': 'error',
    'jest/require-top-level-describe': 'error',
    'jest/valid-describe-callback': 'error',
    'jest/valid-expect': 'error',
    'jest/valid-title': 'error',
    'jest/no-standalone-expect': 'error',
    // TS rules
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  // These rules are applicable to code outside the packages folder only
  overrides: [
    {
      files: ['**/?(*.)+(spec).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
      rules: {
        // React testing library rules
        'testing-library/no-debugging-utils': 'warn',
        'testing-library/await-async-utils': 'error',
        'testing-library/no-await-sync-query': 'error',
        'testing-library/no-wait-for-empty-callback': 'error',
        'testing-library/no-wait-for-side-effects': 'error',
        'testing-library/no-wait-for-snapshot': 'error',
        // Following rules are disabled on purpose
        'testing-library/prefer-screen-queries': 'off', // need to migrate to screen object iteratively
        'testing-library/no-unnecessary-act': 'off', // there are legit cases where we need to use act() in contradiction to this rule
        'testing-library/render-result-naming-convention': 'off',
        'testing-library/no-wait-for-multiple-assertions': 'off',
        'testing-library/no-node-access': 'off',
        'testing-library/no-container': 'off',
        'testing-library/prefer-presence-queries': 'off',
      },
    },
    {
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      extends: ['prettier'],
      plugins: ['@nx', 'prettier'],
      rules: {
        'prettier/prettier': ['error'],
        '@nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: '*',
                onlyDependOnLibsWithTags: ['*'],
              },
            ],
          },
        ],
        'no-eval': 'error',
        'import/no-relative-packages': 'error',
        'no-shadow-restricted-names': 'error',
        'import/no-extraneous-dependencies': 'error',
        'import/no-self-import': 'error',
      },
    },
    {
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:import/typescript',
        'plugin:@nx/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        'prettier',
      ],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/dot-notation': ['error', { allowIndexSignaturePropertyAccess: true }],
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          { allowNumber: true, allowBoolean: true },
        ],
      },
    },
    {
      files: ['src/**/*.{js,jsx}'],
      extends: ['plugin:@nx/javascript'],
      rules: {},
    },
    {
      files: ['src/**/*.spec.{ts,tsx,js,jsx}'],
      env: {
        jest: true,
      },
      rules: {},
    },
    {
      files: ['jest.config.ts'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'eslint-disable import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
